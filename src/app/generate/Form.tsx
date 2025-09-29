"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash } from "lucide-react"

// Loader component
const Loader = () => (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
  </div>
)

type InvoiceItem = {
  description: string
  quantity: number
  unitPrice: number
}

export default function InvoiceForm() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientAddress, setClientAddress] = useState("")
  const [dateIssued, setDateIssued] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ])
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleItemChange = <K extends keyof InvoiceItem>(
    index: number,
    field: K,
    value: string
  ) => {
    const updatedItems = [...items]
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index][field] = Number(value) as InvoiceItem[K]
    } else {
      updatedItems[index][field] = value as InvoiceItem[K]
    }
    setItems(updatedItems)
  }

  const addItem = () =>
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }])

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  const formData = new FormData()
  formData.append("companyName", companyName)
  formData.append("companyAddress", companyAddress)
  formData.append("clientName", clientName)
  formData.append("clientAddress", clientAddress)
  formData.append("dateIssued", dateIssued)
  formData.append("dueDate", dueDate)
  formData.append("items", JSON.stringify(items))
  if (logoFile) formData.append("logo", logoFile)

  try {
    const res = await fetch("/api/generate-invoice", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) throw new Error("Failed to generate invoice")

    const data = await res.json()
    if (data.pdfUrl) {
      router.push(`/generate/success?pdfUrl=${encodeURIComponent(data.pdfUrl)}`)
    }
  } catch (err) {
    console.error(err)
    alert("Error while generating invoice")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="relative max-w-4xl mx-auto p-6">
      {loading && <Loader />} {/* Loader overlay */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="space-y-6 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company & Client Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Your Company</Label>
                <Input
                  id="companyName"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <Input
                  placeholder="Company Address"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
                <div className="mt-2">
                  <Label>Company Logo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setLogoFile(e.target.files ? e.target.files[0] : null)
                    }
                  />
                  {logoFile && <p className="text-sm mt-1">{logoFile.name}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">Bill To</Label>
                <Input
                  id="clientName"
                  placeholder="Client Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <Input
                  placeholder="Client Address"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Date Issued</Label>
                <Input
                  type="date"
                  value={dateIssued}
                  onChange={(e) => setDateIssued(e.target.value)}
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Invoice Items */}
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Invoice Items</h2>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 gap-3 items-center border rounded-lg p-3"
                >
                  <Input
                    placeholder="Description"
                    className="col-span-2"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", e.target.value)
                    }
                  />
                  <div className="text-right font-medium">
                    R{(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeItem(index)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" /> Add Item
              </Button>
            </div>

            {/* Total & Submit */}
            <div className="flex justify-end text-xl font-semibold">
              Total: R
              {items
                .reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
                .toFixed(2)}
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="px-6 py-2">
                Generate Invoice
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
