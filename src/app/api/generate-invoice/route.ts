import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const isProd = process.env.VERCEL === "1";

let puppeteer: typeof import("puppeteer-core") | undefined;
let chromium: typeof import("@sparticuz/chromium") | undefined;

type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

type ChromiumShim = {
  args: string[];
  executablePath: string | (() => Promise<string>);
  headless: boolean;
  defaultViewport: { width: number; height: number } | null;
};

async function loadEngines() {
  if (puppeteer) return;

  if (isProd) {
    const pMod = await import("puppeteer-core");
    puppeteer = pMod as unknown as typeof import("puppeteer-core");
    const cMod = await import("@sparticuz/chromium");
    chromium = cMod as unknown as typeof import("@sparticuz/chromium");
  } else {
    const pMod = await import("puppeteer");
    puppeteer = pMod as unknown as typeof import("puppeteer-core");
  }
}

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  try {
    await loadEngines();

    const formData = await req.formData();
    const companyName = formData.get("companyName")?.toString() || "";
    const companyAddress = formData.get("companyAddress")?.toString() || "";
    const clientName = formData.get("clientName")?.toString() || "";
    const clientAddress = formData.get("clientAddress")?.toString() || "";
    const dateIssued = formData.get("dateIssued")?.toString() || "";
    const dueDate = formData.get("dueDate")?.toString() || "";
    const items: InvoiceItem[] = JSON.parse(formData.get("items")?.toString() || "[]");
    const taxRate = parseFloat(formData.get("taxRate")?.toString() || "0");

    // Logo
    let logoBase64 = "";
    const logoFile = formData.get("logo") as File | null;
    if (logoFile) {
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      const mimeType = logoFile.type || "image/png";
      logoBase64 = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    const invoiceNumber = Date.now().toString();

    // HTML Template
           const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Roboto', Arial, sans-serif; margin:0; padding:0; color:#333; background:#fff;}
    .invoice-container { max-width:800px; margin:auto; padding:40px;}
    header { text-align:center; margin-bottom:40px; }
    .logo img { max-height:80px; margin-bottom:10px; }
    .title { font-size:32px; font-weight:700; margin-bottom:8px; }
    .invoice-meta { font-size:14px; margin-top:10px; }
    .invoice-meta div { margin:2px 0; }
    .addresses { display:flex; justify-content:space-between; margin:40px 0; font-size:14px; }
    .addresses strong { display:block; margin-bottom:6px; font-weight:500; }
    table { width:100%; border-collapse:collapse; margin-bottom:30px; font-size:14px; }
    table th, table td { padding:12px; border:1px solid #ddd; }
    table th { background:#f5f5f5; font-weight:500; text-align:left; }
    table th.rate, table td.rate, table th.amount, table td.amount { text-align:right; }
    .totals { float:right; width:300px; font-size:14px; margin-top:10px; }
    .totals table { width:100%; border:none; }
    .totals td { padding:6px 8px; }
    .totals tr.total-row td { font-weight:700; border-top:2px solid #444; font-size:15px; }
    footer { clear:both; margin-top:60px; text-align:center; font-size:12px; color:#666; border-top:1px solid #eee; padding-top:16px; }
  </style>
</head>
<body>
  <div class="invoice-container">
    <header>
      <div class="logo">${logoBase64 ? `<img src="${logoBase64}" alt="Logo" />` : ""}</div>
      <div class="title">INVOICE</div>
      <div class="invoice-meta">
        <div># ${invoiceNumber}</div>
        <div>Date: ${dateIssued}</div>
        <div>Due: ${dueDate}</div>
      </div>
    </header>
    <div class="addresses">
      <div class="from"><strong>From:</strong>${companyName}<br/>${companyAddress}</div>
      <div class="to"><strong>Bill To:</strong>${clientName}<br/>${clientAddress}</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Quantity</th>
          <th class="rate">Rate</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `<tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td class="rate">R${item.unitPrice.toFixed(2)}</td>
          <td class="amount">R${(item.quantity*item.unitPrice).toFixed(2)}</td>
        </tr>`).join("")}
      </tbody>
    </table>
    <div class="totals">
      <table>
        <tr><td>Subtotal:</td><td>R${subtotal.toFixed(2)}</td></tr>
        <tr><td>Tax (${taxRate}%):</td><td>R${taxAmount.toFixed(2)}</td></tr>
        <tr class="total-row"><td>Total:</td><td>R${total.toFixed(2)}</td></tr>
      </table>
    </div>
    <footer>Thank you for your business!</footer>
  </div>
</body>
</html>`;


    // Launch Puppeteer
    let browser;
    if (isProd) {
      const chromiumShim = chromium as unknown as ChromiumShim;
      const executablePath =
        typeof chromiumShim.executablePath === "function"
          ? await chromiumShim.executablePath()
          : chromiumShim.executablePath;

      browser = await puppeteer!.launch({
        args: chromiumShim.args,
        executablePath,
        headless: chromiumShim.headless,
        defaultViewport: chromiumShim.defaultViewport,
      });
    } else {
      browser = await puppeteer!.launch({ headless: true });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setContent(htmlTemplate, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // Save PDF temporarily to /tmp (or public/invoices for local dev)
    const invoicesDir = isProd ? "/tmp" : path.join(process.cwd(), "public", "invoices");
    if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });

    const fileName = `invoice_${invoiceNumber}.pdf`;
    const filePath = path.join(invoicesDir, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    // Return JSON with download URL
    const pdfUrl = isProd ? `/api/download-invoice?file=${fileName}` : `/invoices/${fileName}`;
    return NextResponse.json({ pdfUrl });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
