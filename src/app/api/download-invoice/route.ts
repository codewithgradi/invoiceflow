import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const isProd = process.env.VERCEL === "1";

// GET -> Download PDF
// DELETE -> Remove PDF from server
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const fileName = url.searchParams.get("file");

    if (!fileName) {
      return NextResponse.json({ error: "No file specified" }, { status: 400 });
    }

    const invoicesDir = isProd ? "/tmp" : path.join(process.cwd(), "tmp");
    const filePath = path.join(invoicesDir, fileName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const fileName = url.searchParams.get("file");

    if (!fileName) {
      return NextResponse.json({ error: "No file specified" }, { status: 400 });
    }

    // tmp folder
    const tmpDir = isProd ? "/tmp" : path.join(process.cwd(), "tmp");
    const tmpPath = path.join(tmpDir, fileName);
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);

    // invoices folder
    const invoicesDir = path.join(process.cwd(), "public", "invoices");
    const invoicesPath = path.join(invoicesDir, fileName);
    if (fs.existsSync(invoicesPath)) fs.unlinkSync(invoicesPath);

    return NextResponse.json({ message: "Invoice deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
