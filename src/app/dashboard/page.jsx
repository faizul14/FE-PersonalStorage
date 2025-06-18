'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import FileCard from '@/components/FileCard'
import { useRouter } from 'next/navigation'

// Buat instance axios dengan konfigurasi dasar
const api = axios.create({
    baseURL: 'https://be-personalstorage-production.up.railway.app/api',
    timeout: 10000, // timeout 10 detik
    headers: {
        'Content-Type': 'application/json',
    }
})

// Tambahkan interceptor untuk handling error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server merespon dengan status code di luar range 2xx
            console.error('Response Error:', error.response.data)
        } else if (error.request) {
            // Request dibuat tapi tidak ada response
            console.error('Request Error:', error.request)
        } else {
            // Error saat setup request
            console.error('Error:', error.message)
        }
        return Promise.reject(error)
    }
)

export default function Dashboard() {
    const [files, setFiles] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    const fetchFiles = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const res = await api.get('/files')
            setFiles(res.data)
        } catch (err) {
            setError('Gagal mengambil data file')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchFiles()
    }, [])

    // Hapus file dari state setelah delete
    const handleDeleteFile = (id) => {
        setFiles((prev) => prev.filter((file) => file._id !== id && file.id !== id));
    }

    // Filter files berdasarkan search term
    const filteredFiles = files.filter(file =>
        file.originalName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-gray-800 text-white px-6 py-2.5 rounded-lg 
              hover:bg-gray-700 transition-all duration-200 
              shadow-sm hover:shadow-md"
                        >
                            Ikat File
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                {/* Files List Section */}
                <div className="bg-white/80 backdrop-blur-lg shadow-sm rounded-2xl p-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h2 className="text-xl font-semibold text-gray-800">Daftar File</h2>
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Cari file..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2.5 
                bg-white border border-gray-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-gray-200
                placeholder-gray-400 text-gray-600
                transition-all duration-200"
                            />
                            <svg
                                className="w-5 h-5 text-gray-400 absolute left-3 top-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50/50 border border-red-100 rounded-lg p-4">
                            <p className="text-red-600 text-center">{error}</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredFiles.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Belum ada file</p>
                                </div>
                            ) : (
                                filteredFiles.map((f) => (
                                    <FileCard
                                        key={f._id || f.id}
                                        file={{
                                            id: f._id,
                                            name: f.originalName,
                                            size: formatFileSize(f.size),
                                            url: f.url,
                                            type: f.mimeType,
                                            date: new Date(f.createdAt).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                        }}
                                        onDelete={handleDeleteFile}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

