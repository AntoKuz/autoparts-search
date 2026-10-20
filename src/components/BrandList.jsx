import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands } from '../store/brandsSlice'
import { fetchOffers } from '../store/offersSlice'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

export default function BrandList() {
  const dispatch = useDispatch()
  const { number, items, status, error } = useSelector((state) => state.brands)
  const selected = useSelector((state) => state.offers.brand)
  const requestRef = useRef(null)

  useEffect(() => () => requestRef.current?.abort(), [])

  if (status === 'idle') return null
  if (status === 'loading') return <Loader text="Ищем производителей..." />
  if (status === 'failed') {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchBrands(number))} />
  }
  if (!items.length) {
    return <div className="alert alert-warning">По артикулу «{number}» ничего не найдено.</div>
  }

  const select = (brand) => {
    requestRef.current?.abort()
    requestRef.current = dispatch(fetchOffers({ number, brand }))
  }

  return (
    <div className="mb-4">
      <h2 className="h5 mb-3">Выберите производителя</h2>
      <div className="list-group">
        {items.map((item) => (
          <button
            key={item.brand}
            type="button"
            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
              selected === item.brand ? 'active' : ''
            }`}
            onClick={() => select(item.brand)}
          >
            <span className="fw-semibold">{item.brand}</span>
            <span className={selected === item.brand ? '' : 'text-secondary'}>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
