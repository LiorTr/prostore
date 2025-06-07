import React from 'react'
import ProductList from '@/components/shared/product/product-list'
import { getLatestProducts } from '@/lib/actions/product.actions'

async function HomePage() {
  const latestProducts = await getLatestProducts()
  return (
    <div>
      <ProductList data={latestProducts} title='Newest Arrivals' limit={4} />
    </div>
  )
}

export default HomePage