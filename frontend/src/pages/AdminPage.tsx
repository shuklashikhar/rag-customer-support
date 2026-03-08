import { useEffect, useState } from 'react'
import { Header } from '../components/Layout/Header'
import { useDocuments } from '../hooks/useDocuments'
import api from '../services/api'

export const AdminPage = () => {
  const { documents, uploading, uploadDocument, deleteDocument } = useDocuments()
  const [stats, setStats] = useState<any>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data.data.stats))
  }, [])

  const handleFile = async (file: File) => {
    setUploadError(null)
    try {
      await uploadDocument(file)
    } catch (err: any) {
      setUploadError(err.message)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const statusColor: Record<string, string> = {
    ready: '#27ae60',
    processing: '#f39c12',
    failed: '#e74c3c'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f1a' }}>
      <Header />
      <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ color: 'white', marginBottom: '32px' }}>Admin Panel</h2>

        {/* Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
            {[
              { label: 'Total Users', value: stats.totalUsers },
              { label: 'Conversations', value: stats.totalConversations },
              { label: 'Messages', value: stats.totalMessages },
              { label: 'Documents', value: stats.totalDocuments },
            ].map(stat => (
              <div key={stat.label} style={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#4a90d9', fontSize: '28px', fontWeight: '700' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ color: '#ccc', marginBottom: '16px' }}>Upload Document</h3>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? '#4a90d9' : '#444'}`,
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: dragOver ? '#1a1a2e' : 'transparent',
              transition: 'all 0.2s'
            }}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📄</div>
            <p style={{ color: '#888', fontSize: '14px' }}>
              {uploading ? 'Uploading...' : 'Drag & drop PDF or CSV, or click to browse'}
            </p>
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.csv"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
          </div>
          {uploadError && (
            <p style={{ color: '#e74c3c', fontSize: '13px', marginTop: '8px' }}>{uploadError}</p>
          )}
        </div>

        {/* Documents list */}
        <div>
          <h3 style={{ color: '#ccc', marginBottom: '16px' }}>Knowledge Base</h3>
          {documents.length === 0 && (
            <p style={{ color: '#555', fontSize: '14px' }}>No documents uploaded yet.</p>
          )}
          {documents.map(doc => (
            <div key={doc.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#1a1a2e',
              border: '1px solid #333',
              borderRadius: '10px',
              padding: '16px 20px',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                  {doc.name}
                </div>
                <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                  {doc.fileType.toUpperCase()} · {doc.chunkCount} chunks
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  color: statusColor[doc.status] || '#888',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  ● {doc.status}
                </span>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #555',
                    color: '#e74c3c',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}