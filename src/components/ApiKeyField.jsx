import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setApiKey } from '../store/settingsSlice'
import { resetBrands } from '../store/brandsSlice'

export default function ApiKeyField() {
  const dispatch = useDispatch()
  const apiKey = useSelector((state) => state.settings.apiKey)
  const [value, setValue] = useState(apiKey)

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(setApiKey(value))
    dispatch(resetBrands())
  }

  return (
    <form className="row g-2 mb-4" onSubmit={handleSubmit}>
      <div className="col-sm">
        <input
          type="text"
          className="form-control"
          placeholder="Ключ API"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="col-sm-auto">
        <button type="submit" className="btn btn-outline-secondary w-100" disabled={value.trim() === apiKey}>
          Сохранить ключ
        </button>
      </div>
    </form>
  )
}
