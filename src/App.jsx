import { useSelector } from 'react-redux'
import ApiKeyField from './components/ApiKeyField'
import SearchForm from './components/SearchForm'
import BrandList from './components/BrandList'
import OffersTable from './components/OffersTable'

export default function App() {
  const hasKey = useSelector((state) => Boolean(state.settings.apiKey))

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Подбор автозапчастей</h1>
      <ApiKeyField />
      {hasKey ? (
        <>
          <SearchForm />
          <BrandList />
          <OffersTable />
        </>
      ) : (
        <div className="alert alert-info">Укажите ключ API, чтобы начать поиск.</div>
      )}
    </div>
  )
}
