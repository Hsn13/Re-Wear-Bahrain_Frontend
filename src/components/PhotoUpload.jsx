import { useRef, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

function CameraModal({ onCapture, onClose }) {
  const videoRef    = useRef(null)
  const canvasRef   = useRef(null)
  const streamRef   = useRef(null)
  const [ready, setReady]   = useState(false)
  const [error, setError]   = useState('')
  const [facingFront, setFacingFront] = useState(false)

  const startCamera = useCallback(async (front = false) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
    }
    setError('')
    setReady(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: front ? 'user' : 'environment' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => setReady(true)
      }
    } catch {
      setError('Could not access camera. Please allow camera permission or use "Choose File" instead.')
    }
  }, [])

  useEffect(() => {
    startCamera(false)
    return () => streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  function stopStream() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  function handleClose() {
    stopStream()
    onClose()
  }

  function handleFlip() {
    const next = !facingFront
    setFacingFront(next)
    startCamera(next)
  }

  function handleSnap() {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      stopStream()
      onCapture(blob)
    }, 'image/jpeg', 0.92)
  }

  return (
    <div className="camera-modal-backdrop" onClick={handleClose}>
      <div className="camera-modal" onClick={e => e.stopPropagation()}>
        <div className="camera-modal-header">
          <span className="camera-modal-title">Take a Photo</span>
          <button className="camera-close-btn" onClick={handleClose} type="button">✕</button>
        </div>

        {error ? (
          <div className="camera-error">
            <p>{error}</p>
            <button className="btn btn-ghost btn-sm" onClick={handleClose} type="button">Close</button>
          </div>
        ) : (
          <>
            <div className="camera-viewfinder">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
                onLoadedMetadata={() => setReady(true)}
              />
              {!ready && <div className="camera-loading">Starting camera…</div>}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="camera-controls">
              <button className="camera-flip-btn" onClick={handleFlip} type="button" title="Flip camera">
                🔄
              </button>
              <button
                className="camera-snap-btn"
                onClick={handleSnap}
                disabled={!ready}
                type="button"
              >
                📸
              </button>
              <div style={{ width: 44 }} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function PhotoUpload({ value, onChange }) {
  const fileInputRef        = useRef(null)
  const [showCamera, setShowCamera] = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function uploadBlob(blobOrFile, filename = 'photo.jpg') {
    setUploadError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', blobOrFile, filename)
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(res.data.url)
    } catch (err) {
      setUploadError(err.response?.data?.err || 'Upload failed. Try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    uploadBlob(file, file.name)
    e.target.value = ''
  }

  function handleCameraCapture(blob) {
    setShowCamera(false)
    uploadBlob(blob, `snap-${Date.now()}.jpg`)
  }

  return (
    <div className="photo-upload-wrapper">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      {showCamera && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {value ? (
        <div className="photo-preview-wrapper">
          <img src={value} alt="Item preview" className="photo-preview" />
          <div className="photo-preview-overlay">
            <button type="button" className="btn btn-ghost btn-sm photo-change-btn"
              onClick={() => fileInputRef.current.click()} disabled={uploading}>
              {uploading ? 'Uploading…' : '✏️ Change'}
            </button>
            <button type="button" className="btn btn-danger btn-sm"
              onClick={() => onChange('')} disabled={uploading}>
              🗑
            </button>
          </div>
        </div>
      ) : (
        <div className={`photo-upload-area${uploading ? ' photo-upload-loading' : ''}`}>
          {uploading ? (
            <div className="photo-upload-spinner">
              <div className="spinner" />
              <p className="photo-upload-hint">Uploading photo…</p>
            </div>
          ) : (
            <>
              <div className="photo-upload-icon">📷</div>
              <p className="photo-upload-title">Add a photo</p>
              <div className="photo-upload-btns">
                <button type="button" className="photo-src-btn"
                  onClick={() => setShowCamera(true)}>
                  <span>📸</span> Camera
                </button>
                <button type="button" className="photo-src-btn"
                  onClick={() => fileInputRef.current.click()}>
                  <span>🖼️</span> Gallery / File
                </button>
              </div>
              <p className="photo-upload-hint">JPG, PNG, WEBP · max 8 MB</p>
            </>
          )}
        </div>
      )}

      {uploadError && <span className="field-error">{uploadError}</span>}
    </div>
  )
}
