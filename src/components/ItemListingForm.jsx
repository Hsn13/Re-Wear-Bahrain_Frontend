import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router'
import api from '../services/api'
import PhotoUpload from './PhotoUpload'
import { useTranslation } from '../i18n'

const PickupLocationPicker = lazy(() => import('./PickupLocationPicker'))

const CATEGORIES = ['tops', 'bottoms', 'dresses', 'outerwear', 'footwear', 'accessories', 'kids', 'other']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Kids']
const CONDITIONS = ['new', 'like-new', 'good', 'fair']

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'tops',
  size: 'M',
  condition: 'good',
  imageUrl: '',
  ecoCreditsPrice: 5,
  pickupType: 'public',
  pickupAddress: '',
  pickupInstructions: '',
  pickupCoordinates: null
}

export default function ItemListingForm({ initialData = EMPTY_FORM, isEdit = false, onSubmit }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState(() => ({ ...EMPTY_FORM, ...initialData }))
  const [bands, setBands] = useState(null)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/policy/credits')
      .then(response => setBands(response.data))
      .catch(() => setServerError(t('list.policyUnavailable')))
  }, [t])

  const group = bands?.categoryGroups?.[formData.category]
  const range = group && bands?.bands?.[group]?.[formData.condition]

  function handleChange(event) {
    const { name, value } = event.target
    setFormData(previous => {
      const next = { ...previous, [name]: value }
      const nextGroup = bands?.categoryGroups?.[next.category]
      const nextRange = nextGroup && bands?.bands?.[nextGroup]?.[next.condition]
      if ((name === 'category' || name === 'condition') && nextRange &&
          (Number(next.ecoCreditsPrice) < nextRange[0] || Number(next.ecoCreditsPrice) > nextRange[1])) {
        next.ecoCreditsPrice = nextRange[0]
      }
      return next
    })
    setErrors(previous => ({ ...previous, [name]: '' }))
  }

  function validate() {
    const nextErrors = {}
    if (formData.title.trim().length < 3 || formData.title.trim().length > 100) {
      nextErrors.title = t('validation.title')
    }
    if (formData.description.trim().length < 20 || formData.description.trim().length > 500) {
      nextErrors.description = t('validation.description')
    }
    if (!formData.imageUrl) nextErrors.imageUrl = t('list.photoRequired')
    if (!range || Number(formData.ecoCreditsPrice) < range[0] || Number(formData.ecoCreditsPrice) > range[1]) {
      nextErrors.ecoCreditsPrice = t('validation.price')
    }
    if (!formData.pickupAddress.trim() || !formData.pickupCoordinates) {
      nextErrors.pickupAddress = t('list.pickupRequired')
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        size: formData.size,
        condition: formData.condition,
        images: [formData.imageUrl],
        ecoCreditsPrice: Number(formData.ecoCreditsPrice),
        pickupLocation: {
          type: formData.pickupType,
          address: formData.pickupAddress.trim(),
          instructions: formData.pickupInstructions.trim(),
          coordinates: formData.pickupCoordinates
        },
        truthConfirmed: true
      })
    } catch (error) {
      setServerError(error.response?.data?.err || t('auth.error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container-sm form-page">
      <header className="form-page-heading">
        <span className="section-eyebrow">{isEdit ? t('list.editEyebrow') : t('list.eyebrow')}</span>
        <h1>{isEdit ? t('list.editTitle') : t('list.title')}</h1>
        <p className="form-subtitle">{isEdit ? t('list.editSubtitle') : t('list.subtitle')}</p>
      </header>

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="title">{t('list.titleLabel')}</label>
            <input id="title" name="title" className="form-input" required minLength={3} maxLength={100}
              value={formData.title} onChange={handleChange} />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">{t('list.description')}</label>
            <textarea id="description" name="description" className="form-textarea" rows={4}
              minLength={20} maxLength={500} value={formData.description} onChange={handleChange} />
            <span className="form-hint">{t('list.descriptionHint')} · {formData.description.length}/500</span>
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="form-field-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="category">{t('list.category')}</label>
              <select id="category" name="category" className="form-select" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map(category => <option value={category} key={category}>{t(`category.${category}`)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="size">{t('list.size')}</label>
              <select id="size" name="size" className="form-select" value={formData.size} onChange={handleChange}>
                {SIZES.map(size => <option value={size} key={size}>{size}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="condition">{t('list.condition')}</label>
              <select id="condition" name="condition" className="form-select" value={formData.condition} onChange={handleChange}>
                {CONDITIONS.map(condition => <option value={condition} key={condition}>{t(`condition.${condition}`)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ecoCreditsPrice">{t('list.credits')}</label>
              <select id="ecoCreditsPrice" name="ecoCreditsPrice" className="form-select"
                value={formData.ecoCreditsPrice} onChange={handleChange} disabled={!range}>
                {range?.map(value => <option value={value} key={value}>{value} ◈</option>)}
              </select>
              {range && <span className="form-hint">{range[0]}–{range[1]} ◈ · {t('list.creditHint')}</span>}
              {errors.ecoCreditsPrice && <span className="field-error">{errors.ecoCreditsPrice}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('list.photo')}</label>
            <PhotoUpload value={formData.imageUrl} onChange={imageUrl => setFormData(previous => ({ ...previous, imageUrl }))} />
            <span className="form-hint">{t('list.photoHint')}</span>
            {errors.imageUrl && <span className="field-error">{errors.imageUrl}</span>}
          </div>

          <fieldset className="pickup-fieldset">
            <legend>{t('list.pickupTitle')}</legend>
            <p className="form-hint">{t('list.pickupPrivacy')}</p>
            <div className="form-group">
              <label className="form-label" htmlFor="pickupType">{t('list.pickupType')}</label>
              <select id="pickupType" name="pickupType" className="form-select"
                value={formData.pickupType} onChange={handleChange}>
                <option value="public">{t('list.publicMeetup')}</option>
                <option value="private">{t('list.privatePickup')}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pickupAddress">{t('list.pickupAddress')}</label>
              <input id="pickupAddress" name="pickupAddress" className="form-input" required maxLength={240}
                value={formData.pickupAddress} onChange={handleChange} />
              {errors.pickupAddress && <span className="field-error">{errors.pickupAddress}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pickupInstructions">{t('list.pickupInstructions')}</label>
              <textarea id="pickupInstructions" name="pickupInstructions" className="form-textarea" rows={2}
                maxLength={500} value={formData.pickupInstructions} onChange={handleChange} />
            </div>
            <Suspense fallback={<p className="loading-msg">{t('status.loading')}</p>}>
              <PickupLocationPicker coordinates={formData.pickupCoordinates}
                onChange={pickupCoordinates => setFormData(previous => ({ ...previous, pickupCoordinates }))} />
            </Suspense>
          </fieldset>

          <label className="truth-confirmation">
            <input type="checkbox" required />
            <span>{t('list.confirmTruth')} <Link to="/guidelines">{t('nav.guidelines')}</Link></span>
          </label>
          {serverError && <p className="error-msg" role="alert">{serverError}</p>}
          <button type="submit" className="btn btn-primary btn-full form-submit"
            disabled={submitting || !bands || !range}>
            {submitting ? (isEdit ? t('list.saving') : t('list.publishing'))
              : (isEdit ? t('list.save') : t('list.publish'))}
          </button>
        </form>
      </div>
    </div>
  )
}
