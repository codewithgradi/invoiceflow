"use client"
import React, { Suspense} from 'react'
import InvoiceGenerated from '@/app/generate/success/InvoiceGenerated'
import Loader from '@/components/Loader'

const PageOnSuccess = () => {
  return (
    <div>
      <Suspense fallback={<Loader/>}>
       <InvoiceGenerated/>
      </Suspense>
    </div>
  )
}

export default PageOnSuccess
