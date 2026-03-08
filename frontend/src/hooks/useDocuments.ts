import { useState, useEffect } from 'react'
import api from '../services/api'
import type  { Document } from '../types/document.types'

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const res = await api.get('/documents')
      setDocuments(res.data.data.documents)
    } catch (err) {
      console.error('Failed to fetch documents:', err)
    } finally {
      setLoading(false)
    }
  }

  const uploadDocument = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      // Poll for status update
      setTimeout(fetchDocuments, 3000)
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      await api.delete(`/documents/${id}`)
      setDocuments(prev => prev.filter(d => d.id !== id))
    } catch (err) {
      console.error('Failed to delete document:', err)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  return { documents, uploading, loading, uploadDocument, deleteDocument, fetchDocuments }
}