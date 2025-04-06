"use client"

import PageHeader from '@/components/blocks/page-header'
import { Input } from '@/components/ui/input'
import { FileText, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface PDFFile {
  id: number
  name: string
}

const PDF_FILES: PDFFile[] = [
  { id: 1, name: 'Annual Report 2023' },
  { id: 2, name: 'Financial Statements Q1' },
  { id: 3, name: 'Employee Handbook' },
  { id: 4, name: 'Project Proposal Template' },
  { id: 5, name: 'Company Policies' },
]

const DirectoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

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
              <Link
                key={pdf.id}
                href={`/pdfs/${pdf.id}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <FileText className="text-red-500" size={24} />
                <div>
                  <h3 className="font-medium">{pdf.name}</h3>
                  <p className="text-sm text-gray-500">PDF Document</p>
                </div>
              </Link>
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