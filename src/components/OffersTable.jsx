import { useDispatch, useSelector } from 'react-redux'
import { fetchOffers } from '../store/offersSlice'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'

const priceFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' })

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })
}

export default function OffersTable() {
  const dispatch = useDispatch()
  const number = useSelector((state) => state.brands.number)
  const { brand, items, status, error } = useSelector((state) => state.offers)

  if (status === 'idle') return null
  if (status === 'loading') return <Loader text="Загружаем предложения..." />
  if (status === 'failed') {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchOffers({ number, brand }))} />
  }
  if (!items.length) {
    return <div className="alert alert-warning">Предложений для {brand} {number} нет.</div>
  }

  return (
    <div>
      <h2 className="h5 mb-3">
        Предложения и аналоги: {brand} {number}
      </h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Производитель</th>
              <th>Артикул</th>
              <th>Наименование</th>
              <th>Склад</th>
              <th className="text-end">Цена</th>
              <th className="text-end">Остаток</th>
              <th>Отгрузка</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="fw-semibold">
                  {item.brand}
                  {item.isAnalogue && <span className="badge text-bg-secondary ms-2">аналог</span>}
                </td>
                <td>{item.number}</td>
                <td>{item.name}</td>
                <td>{item.warehouse}</td>
                <td className="text-end text-nowrap">{item.price != null ? priceFormat.format(item.price) : '—'}</td>
                <td className="text-end">{item.stock}</td>
                <td className="text-nowrap">{formatDate(item.shipmentDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
