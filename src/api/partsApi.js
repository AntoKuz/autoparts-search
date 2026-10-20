const API_URL = '/api/'

export class ApiError extends Error {}

function extractError(payload, fallback) {
  if (!payload) return fallback
  if (typeof payload === 'string') return payload.trim() || fallback
  return payload.error || payload.message || payload.Error || fallback
}

export async function requestParts({ key, number, brand, analogues, signal }) {
  const params = new URLSearchParams({ key, number })
  if (brand) params.set('brand', brand)
  if (analogues) params.set('analogues', 'on')

  let response
  try {
    response = await fetch(`${API_URL}?${params}`, { signal })
  } catch (e) {
    if (e.name === 'AbortError') throw e
    throw new ApiError('Не удалось связаться с сервером. Проверьте подключение к сети.')
  }

  const text = await response.text()
  let payload = text
  try {
    payload = JSON.parse(text)
  } catch {
    payload = text
  }

  if (!response.ok) {
    throw new ApiError(extractError(payload, `Ошибка сервера: ${response.status}`))
  }

  if (!payload || !Array.isArray(payload.goods)) {
    throw new ApiError(extractError(payload, 'Некорректный ответ сервера'))
  }

  return payload.goods
}
