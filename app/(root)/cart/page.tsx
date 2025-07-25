import React from 'react'
import CartTable from './cart-table'
import { getMyCart } from '@/lib/actions/cart.actions'
export const metadata = {
  title: 'shopping cart'
}
async function CartPage() {
  const cart = await getMyCart()

  return (
    <CartTable cart={cart} />
  )
}

export default CartPage