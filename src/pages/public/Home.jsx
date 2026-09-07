import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Katalog UMKM Desa Pasiragung</h1>
      <p className="text-gray-600 max-w-md mb-6">
        Selamat datang di katalog produk unggulan hasil karya warga Desa Pasiragung.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Masuk ke Portal Admin
        </Link>
      </div>
    </div>
  )
}

export default Home
