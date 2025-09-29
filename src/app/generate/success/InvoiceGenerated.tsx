"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Plus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function InvoiceGenerated() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pdfUrl = searchParams.get("pdfUrl") || ""; 

const handleDownload = async () => {
  if (!pdfUrl) return;

  // Open the PDF in a new tab (triggers browser download)
  window.open(pdfUrl, "_blank");

  // Extract the file name from the URL
  const fileName = pdfUrl.split("/").pop();
  if (!fileName) return;

  // Call DELETE endpoint to remove the file
  try {
    await fetch(`/api/download-invoice?file=${fileName}`, {
      method: "DELETE",
    });
    console.log("File deleted from server");
  } catch (err) {
    console.error("Failed to delete file:", err);
  }

  //Redirect back to the form
  router.push("/generate");
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardContent className="space-y-6 p-8 text-center">
          <h1 className="text-3xl font-bold text-green-600">✅ Invoice Generated</h1>
          <p className="text-gray-600">
            Your invoice has been successfully created. You can download it below.
          </p>

          {/* Download Button */}
          {pdfUrl ? (
            <Button
              variant="default"
              className="w-full flex justify-center items-center gap-2"
              onClick={handleDownload}
            >
              <FileDown className="h-5 w-5" /> Download PDF
            </Button>
          ) : (
            <p className="text-red-500">No invoice available.</p>
          )}

          {/* Create Another Invoice */}
          <Button
            variant="outline"
            className="w-full flex justify-center items-center gap-2"
            onClick={() => router.push("/generate")}
          >
            <Plus className="h-5 w-5" /> Create New Invoice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
