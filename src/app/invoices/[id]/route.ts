import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import formidable, { File, Fields, Files } from "formidable";
import puppeteer from "puppeteer";
import { IncomingMessage } from "http";

export const config = { api: { bodyParser: false } };

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

// ---------------- POST - generate invoice ----------------
export async function POST(req: Request) {
  const form = new formidable.IncomingForm({ multiples: false });

  return new Promise<NextResponse>((resolve) => {
    form.parse(req as unknown as IncomingMessage, async (err, fields: Fields, files: Files) => {
      if (err) {
        console.error("Form parse error:", err);
        return resolve(
          NextResponse.json(
            { success: false, message: "Form parse error" },
            { status: 500 }
          )
        );
      }

      try {
        // Normalize fields to strings
        const data: Record<string, string> = {};
        for (const key in fields) {
          const value = fields[key];
          if (Array.isArray(value)) {
            data[key] = value[0];
          } else if (value === undefined || value === null) {
            data[key] = "";
          } else {
            data[key] = value;
          }
        }

        const items: InvoiceItem[] = JSON.parse(data.items || "[]"); // parse invoice items
        const logo = files.logo as File | undefined;
        const logoPath = logo ? path.resolve(logo.filepath) : null;

        // HTML template
        const html = `
          <div style="font-family: sans-serif; padding: 20px;">
            ${logoPath ? `<img src="file://${logoPath}" width="150"/>` : ""}
            <h1>Invoice for ${data.companyName}</h1>
            <p>Client: ${data.clientName}</p>
            <p>Address: ${data.clientAddress}</p>
            <hr/>
            <h2>Items:</h2>
            <ul>
              ${items
                .map(
                  (item: InvoiceItem) =>
                    `<li>${item.description} - ${item.quantity} x R${item.unitPrice.toFixed(
                      2
                    )} = R${(item.quantity * item.unitPrice).toFixed(2)}</li>`
                )
                .join("")}
            </ul>
            <h3>Total: R${items
              .reduce((sum: number, i: InvoiceItem) => sum + i.quantity * i.unitPrice, 0)
              .toFixed(2)}</h3>
          </div>
        `;

        const invoiceId = Date.now().toString();
        const invoicesDir = path.join(process.cwd(), "public", "invoices");
        if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });
        const pdfPath = path.join(invoicesDir, `invoice_${invoiceId}.pdf`);

        const browser = await puppeteer.launch({ args: ["--no-sandbox"], headless: true });
        const page = await browser.newPage();
        await page.setContent(html);
        await page.pdf({ path: pdfPath, format: "A4" });
        await browser.close();

        resolve(
          NextResponse.json({
            success: true,
            pdfUrl: `/api/generate-invoice/${invoiceId}`, // GET route
          })
        );
      } catch (error) {
        console.error("PDF generation error:", error);
        resolve(
          NextResponse.json(
            { success: false, message: "PDF generation failed" },
            { status: 500 }
          )
        );
      }
    });
  });
}

// ---------------- GET - download invoice ----------------
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const pdfPath = path.join(process.cwd(), "public", "invoices", `invoice_${id}.pdf`);

  if (!fs.existsSync(pdfPath)) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const pdfBuffer = fs.readFileSync(pdfPath);
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice_${id}.pdf`,
    },
  });
}

// ---------------- DELETE - remove invoice ----------------
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const filePath = path.join(process.cwd(), "public", "invoices", `invoice_${params.id}.pdf`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, message: "File not found" }, { status: 404 });
    }

    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true, message: "File deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ success: false, message: "Error deleting file" }, { status: 500 });
  }
}
