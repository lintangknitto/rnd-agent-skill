import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createProduct,
  getProduct,
  updateProduct,
  type ProductInput,
  type ProductStatus,
} from '../mock/products'
import { Button } from '../components/Button'
import { FileUpload } from '../components/FileUpload'
import { ErrorState, LoadingSkeleton } from '../components/States'
import { useToast } from '../context/ToastContext'

type FormErrors = Partial<Record<keyof ProductInput | 'form', string>>

const empty: ProductInput = {
  name: '',
  category: '',
  price: 0,
  status: 'draft',
  description: '',
  thumbnail: undefined,
}

export function ProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [values, setValues] = useState<ProductInput>(empty)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setLoadError(null)
      try {
        const product = await getProduct(id)
        if (cancelled) return
        if (!product) {
          setLoadError('Product not found')
          return
        }
        setValues({
          name: product.name,
          category: product.category,
          price: product.price,
          status: product.status,
          description: product.description,
          thumbnail: product.thumbnail,
        })
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load product')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  function validate(input: ProductInput): FormErrors {
    const next: FormErrors = {}
    if (!input.name.trim()) next.name = 'Name is required'
    if (!input.category.trim()) next.category = 'Category is required'
    if (input.price === undefined || Number.isNaN(input.price)) next.price = 'Price is required'
    else if (input.price < 0) next.price = 'Price must be 0 or greater'
    if (!input.description.trim()) next.description = 'Description is required'
    return next
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSaving(true)
    try {
      if (isEdit && id) {
        await updateProduct(id, values)
        showToast('Product updated', 'success')
      } else {
        await createProduct(values)
        showToast('Product created', 'success')
      }
      navigate('/products')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed'
      setErrors({ form: message })
      showToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSkeleton />
  if (loadError) {
    return (
      <div data-testid="product-form-page">
        <ErrorState message={loadError} onRetry={() => navigate('/products')} />
      </div>
    )
  }

  return (
    <div data-testid="product-form-page">
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit product' : 'New product'}</h1>
          <p>Required fields, validation errors, and image upload preview.</p>
        </div>
        <Link to="/products" className="btn btn-ghost" data-testid="form-back">
          Back to list
        </Link>
      </div>

      <form className="form card" onSubmit={onSubmit} noValidate data-testid="product-form">
        <div className="field">
          <label htmlFor="product-name">Name</label>
          <input
            id="product-name"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            data-testid="product-name"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? (
            <span className="field-error" role="alert" data-testid="product-name-error">
              {errors.name}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="product-category">Category</label>
          <input
            id="product-category"
            value={values.category}
            onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
            data-testid="product-category"
            aria-invalid={Boolean(errors.category)}
          />
          {errors.category ? (
            <span className="field-error" role="alert" data-testid="product-category-error">
              {errors.category}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="product-price">Price</label>
          <input
            id="product-price"
            type="number"
            min={0}
            step="0.01"
            value={values.price}
             onChange={(e) =>
               setValues((v) => ({
                 ...v,
                 price: e.target.value === '' ? Number.NaN : Number(e.target.value),
               }))
             }
            data-testid="product-price"
            aria-invalid={Boolean(errors.price)}
          />
          {errors.price ? (
            <span className="field-error" role="alert" data-testid="product-price-error">
              {errors.price}
            </span>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="product-status">Status</label>
          <select
            id="product-status"
            value={values.status}
            onChange={(e) =>
              setValues((v) => ({ ...v, status: e.target.value as ProductStatus }))
            }
            data-testid="product-status"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            rows={4}
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            data-testid="product-description"
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description ? (
            <span className="field-error" role="alert" data-testid="product-description-error">
              {errors.description}
            </span>
          ) : null}
        </div>

        <FileUpload
          value={values.thumbnail}
          onChange={(thumbnail) => setValues((v) => ({ ...v, thumbnail }))}
        />

        {errors.form ? (
          <p className="field-error" role="alert" data-testid="product-form-error">
            {errors.form}
          </p>
        ) : null}

        <div className="btn-row">
          <Button type="submit" variant="primary" disabled={saving} data-testid="product-save">
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/products')}
            data-testid="product-cancel"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
