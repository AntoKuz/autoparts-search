import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchBrands, resetBrands } from '../store/brandsSlice'

const MIN_LENGTH = 3
const DEBOUNCE_MS = 600

export default function SearchForm() {
  const dispatch = useDispatch()
  const [number, setNumber] = useState('')
  const requestRef = useRef(null)

  const search = (value) => {
    requestRef.current?.abort()
    requestRef.current = dispatch(fetchBrands(value))
  }

  useEffect(() => {
    const value = number.trim()
    if (value.length < MIN_LENGTH) {
      requestRef.current?.abort()
      dispatch(resetBrands())
      return
    }
    const timer = setTimeout(() => search(value), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [number])

  useEffect(() => () => requestRef.current?.abort(), [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = number.trim()
    if (value.length >= MIN_LENGTH) search(value)
  }

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <label htmlFor="number" className="form-label fw-semibold">
        Артикул детали
      </label>
      <input
        id="number"
        type="text"
        className="form-control form-control-lg"
        placeholder="Например, 7160500039S"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        autoComplete="off"
        autoFocus
      />
      <div className="form-text">Поиск начнётся автоматически после ввода {MIN_LENGTH} и более символов.</div>
    </form>
  )
}
