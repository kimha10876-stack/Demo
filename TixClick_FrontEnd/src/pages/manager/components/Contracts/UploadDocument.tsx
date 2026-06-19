import type React from "react"

import { Upload, UploadIcon, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../../components/ui/dialog"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import managerApi from "../../../../services/manager/ManagerApi"


interface UploadDocumentDialogProps {
  contractId: number
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function UploadDocumentDialog({ contractId, isOpen, onClose, onSuccess }: UploadDocumentDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload")
      return
    }

    try {
      setIsUploading(true)
      const response = await managerApi.uploadContractDocument(contractId, file)

      if (response.data && response.data.code === 0) {
        toast.success("Document Uploaded", {
          description: "The document has been successfully uploaded.",
        })
        setFile(null)
        onSuccess()
        onClose()
      } else {
        toast.error("Upload Failed", {
          description: response.data.message || "Failed to upload document.",
        })
      }
    } catch (error) {
      toast.error("Upload Failed", {
        description: "An error occurred while uploading the document.",
      })
      console.error("Error uploading document:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2A2A2A] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>Upload a document for contract #{contractId}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Document File</Label>
            {!file ? (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-[#1E1E1E] border-gray-600 hover:border-gray-500"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                  </div>
                  <Input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-[#1E1E1E] rounded-lg">
                <div className="flex items-center">
                  <UploadIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="text-black" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

