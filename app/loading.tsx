import React from 'react'
import Loader from '@/assets/loader.gif'
import Image from 'next/image'


function LoadingPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
      <Image src={Loader} height={150} width={150} alt='loading...' />
    </div>
  )
}

export default LoadingPage