"use client"

import PageHeader from '@/components/blocks/page-header'
import { Input } from '@/components/ui/input'
import { FileText, Search, Trash2 } from 'lucide-react' // Import Trash2 icon
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button' // Import Button component if needed

interface PDFFile {
  id: number
  name: string
}

const PDF_FILES: PDFFile[] = [
  { id: 1, name: 'Diesel Engine Maintenance Guide' },
  { id: 2, name: 'Heavy-Duty Truck Repair Manual' },
  { id: 3, name: 'Garage Safety Protocols' },
  { id: 4, name: 'Fuel Injection System Diagnostics' },
  { id: 5, name: 'EPA Emissions Compliance Checklist' },
]

const DirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Placeholder delete function - replace with actual logic
  const handleDelete = (id: number) => {
    console.log(`Delete PDF with id: ${id}`)
    // Add logic here to remove the PDF from the list or call an API
    // For now, it just logs to the console
  }

  const filteredPDFs = PDF_FILES.filter(pdf =>
    pdf.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <PageHeader firstLinkName="Directory" secondLinkName="Directory Page" />
      <div className="px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl">Directory</h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredPDFs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPDFs.map((pdf) => (
              <div
                key={pdf.id}
                className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center justify-between gap-3"
              >
                <Link
                  href={`/pdfs/${pdf.id}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 flex-grow"
                >
                  <FileText className="text-red-500 flex-shrink-0" size={24} />
                  <div className="flex-grow">
                    <h3 className="font-medium break-words">{pdf.name}</h3>
                    <p className="text-sm text-gray-500">PDF Document</p>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault() // Prevent link navigation
                    e.stopPropagation() // Prevent triggering hover effects on parent
                    handleDelete(pdf.id)
                  }}
                  className="text-gray-500 hover:text-red-600 flex-shrink-0"
                  aria-label={`Delete ${pdf.name}`}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No documents found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DirectoryPage