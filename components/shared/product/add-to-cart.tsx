'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Cart, CartItem } from '@/types'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Plus, Minus, Loader } from 'lucide-react'

function AddToCart({ cart, item }: { cart?: Cart, item: CartItem }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item)

      if (!res || !res.success) {
        toast.error(res?.message || 'Something went wrong')
        return
      }


      toast.success(`${res?.message}`, {
        action: {
          label: 'Go to Cart',
          onClick: () => router.push('/cart'),
        },
      })
    })
  }


  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId)
      if (!res || !res.success) {
        toast.error(res?.message || 'Something went wrong')
        return
      }
      toast.success(`${res?.message}`, {
        action: {
          label: 'Go to Cart',
          onClick: () => router.push('/cart'),
        },
      })
    }

    )
  }

  // Check if item is in cart
  const existItem = cart && cart.items.find((exist) => exist.productId === item.productId)

  return existItem ? (
    <div>
      <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Minus className='h-4 w-4' />
        )}

      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button type='button' variant='outline' onClick={handleAddToCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Plus className='h-4 w-4' />
        )}
      </Button>
    </div>
  ) : (

    <Button className='w-full' type='button' onClick={handleAddToCart}>
      {isPending ? (
        <Loader className='w-4 h-4 animate-spin' />
      ) : (
        <Plus />
      )}{' '} Add to cart
    </Button>
  )
}


export default AddToCart
