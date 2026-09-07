import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

const App = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data, error }) => {
      if (error) console.error(error)
      else setCategories(data)
    })
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Test koneksi Supabase</h1>
      <p>Jumlah kategori: {categories.length}</p>
    </div>
  )
}
export default App