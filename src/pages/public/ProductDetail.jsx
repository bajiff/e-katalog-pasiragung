import { useParams, Link } from 'react-router-dom'

const ProductDetail = () => {
  const { id } = useParams()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Kembali ke Katalog</Link>
      <h1 className="text-2xl font-bold">Detail Produk #{id}</h1>
      <p className="text-gray-500 mt-2">Halaman detail produk sedang dalam pengembangan.</p>
    </div>
  )
}

export default ProductDetail
