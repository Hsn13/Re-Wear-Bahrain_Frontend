import { useRef, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useTranslation } from '../i18n'

function CameraModal({ onCapture, onClose }) {
  const { t } = useTranslation()
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
      setError(t('photo.cameraError'))
    }
  }, [t])

  useEffect(() => {
    let cancelled = false

    async function initializeCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach(track => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => setReady(true)
        }
      } catch {
        if (!cancelled) {
          setError(t('photo.cameraError'))
        }
      }
    }

    initializeCamera()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [t])

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
      if (blob) onCapture(blob)
    }, 'image/jpeg', 0.92)
  }

  return (
    <div className="camera-modal-backdrop" onClick={handleClose}>
      <div className="camera-modal" onClick={e => e.stopPropagation()}>
        <div className="camera-modal-header">
          <span className="camera-modal-title">{t('photo.takePhoto')}</span>
          <button className="camera-close-btn" onClick={handleClose} type="button" aria-label={t('photo.close')}>✕</button>
        </div>

        {error ? (
          <div className="camera-error">
            <p>{error}</p>
            <button className="btn btn-ghost btn-sm" onClick={handleClose} type="button">{t('photo.close')}</button>
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
              {!ready && <div className="camera-loading">{t('photo.startingCamera')}</div>}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="camera-controls">
              <button className="camera-flip-btn" onClick={handleFlip} type="button" title={t('photo.flip')}>
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
  const { t } = useTranslation()
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
      setUploadError(err.response?.data?.err || t('photo.uploadFailed'))
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
        accept="image/jpeg,image/png,image/webp"
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
              {uploading ? t('photo.uploading') : `✏️ ${t('photo.change')}`}
            </button>
            <button type="button" className="btn btn-danger btn-sm"
              onClick={() => onChange('')} disabled={uploading}>
              {t('photo.remove')}
            </button>
          </div>
        </div>
      ) : (
        <div className={`photo-upload-area${uploading ? ' photo-upload-loading' : ''}`}>
          {uploading ? (
            <div className="photo-upload-spinner">
              <div className="spinner" />
              <p className="photo-upload-hint">{t('photo.uploading')}</p>
            </div>
          ) : (
            <>
              <div className="photo-upload-icon">📷</div>
              <p className="photo-upload-title">{t('photo.add')}</p>
              <div className="photo-upload-btns">
                <button type="button" className="photo-src-btn"
                  onClick={() => setShowCamera(true)}>
                  <span>📸</span> {t('photo.camera')}
                </button>
                <button type="button" className="photo-src-btn"
                  onClick={() => fileInputRef.current.click()}>
                  <span>🖼️</span> {t('photo.gallery')}
                </button>
              </div>
              <p className="photo-upload-hint">{t('photo.hint')}</p>
            </>
          )}
        </div>
      )}

      {uploadError && <span className="field-error">{uploadError}</span>}
    </div>
  )
}
