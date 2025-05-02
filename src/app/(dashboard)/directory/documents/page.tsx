"use client"

import PageHeader from '@/components/blocks/page-header'
import { Input } from '@/components/ui/input'
import { FileText, Plus, Search, Trash2, Loader2, Upload } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { AddDocumentDialog } from './add-document-dialog'
import { ConfirmationDialog } from './confirmation-dialog';

interface DocumentFile {
  url: string;
  publicId: string;
}

interface Document {
  _id: string; // Changed from id to _id
  name: string;
  description?: string;
  file: DocumentFile;
  createdAt: string;
  updatedAt: string;
}

// API function to fetch documents
const fetchDocuments = async (): Promise<Document[]> => {
  const { data } = await api.get('/documents') // Use api instance
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch documents')
  }
  return data.data
}

// API function to delete a document
const deleteDocument = async (id: string): Promise<void> => {
  const { data } = await api.delete(`/documents/${id}`) // Use api instance and correct endpoint
  if (!data.success) {
    throw new Error(data.message || 'Failed to delete document')
  }
}

// API function to add a document
const addDocument = async (formData: FormData): Promise<Document> => {
  const { data } = await api.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  if (!data.success) {
    throw new Error(data.message || 'Failed to add document');
  }
  return data.data;
};

const DirectoryPage = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false); // State for confirmation dialog
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null); // State for document ID to delete
  const queryClient = useQueryClient()

  // Fetch documents using useQuery
  const { data: documents, isLoading, error } = useQuery<Document[], Error>({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  })

  // Delete document mutation
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.success('Document deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['documents'] }) // Refetch documents after deletion
    },
    onError: (error) => {
      toast.error(`Failed to delete document: ${error.message}`)
    },
  })

  // Add document mutation (This is the correct place)
  const addMutation = useMutation<Document, Error, FormData>({
    mutationFn: addDocument,
    onSuccess: (newDocument) => {
      toast.success(`Document "${newDocument.name}" added successfully`)
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      setAddDialogOpen(false) // Close dialog on success
    },
    onError: (error) => {
      toast.error(`Failed to add document: ${error.message}`)
    },
  })

  const handleDeleteClick = (id: string) => {
    setDocumentToDelete(id); // Set the ID of the document to delete
    setConfirmDeleteDialogOpen(true); // Open the confirmation dialog
  }

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      deleteMutation.mutate(documentToDelete);
    }
    setConfirmDeleteDialogOpen(false); // Close the dialog after confirmation
    setDocumentToDelete(null); // Reset the document ID
  };

  const filteredDocuments = documents?.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? []

  return (
    <div>
      <PageHeader firstLinkName="Directory" secondLinkName="Directory Page" />
      <div className="px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl">Directory</h2>
         <div className='flex gap-2'>
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
            placeholder="Search Documents"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Button to open the Add Document Dialog */}
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-xl cursor-pointer"
            onClick={() => setAddDialogOpen(true)} // Open the dialog
          >
            <Plus />
          </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="ml-2 text-gray-500">Loading documents...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-500">
            <p>Error loading documents: {error.message}</p>
          </div>
        )}

        {!isLoading && !error && filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center justify-between gap-3"
              >
                <Link
                  href={doc.file.url} // Link directly to the file URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 flex-grow min-w-0" // Added min-w-0 for flex shrink
                >
                  <FileText className="text-red-500 flex-shrink-0" size={24} />
                  <div className="flex-grow overflow-hidden"> {/* Added overflow-hidden */}
                    <h3 className="font-medium break-words truncate">{doc.name}</h3> {/* Added truncate */}
                    <p className="text-sm text-gray-500">PDF Document</p> {/* Consider making this dynamic based on file type */}
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDeleteClick(doc._id) // Use the new handler
                  }}
                  disabled={deleteMutation.isPending && deleteMutation.variables === doc._id} // Disable only if this specific doc is being deleted
                  className="text-gray-500 hover:text-red-600 flex-shrink-0"
                  aria-label={`Delete ${doc.name}`}
                >
                  {deleteMutation.isPending && deleteMutation.variables === doc._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : !isLoading && !error && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {documents && documents.length === 0 ? 'No documents found.' : 'No documents found matching your search.'}
            </p>
          </div>
        )}
      </div>

      {/* Render the Add Document Dialog */}
      <AddDocumentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={addMutation.mutate}
        isLoading={addMutation.isPending}
      />

      {/* Confirmation Dialog for Deletion */}
      <ConfirmationDialog
        open={confirmDeleteDialogOpen}
        onOpenChange={setConfirmDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this document? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteMutation.isPending && deleteMutation.variables === documentToDelete} // Show loading state during deletion
      />
    </div>
  )
}
export default DirectoryPage
