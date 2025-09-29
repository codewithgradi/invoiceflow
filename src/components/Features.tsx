import React from 'react'
import Image from 'next/image'
import Hero from '/public/headerImage.png'


const Features = () => {
  return (
      <section >
          <div className='flex justify-around p-4 items-center font-semibold text-blue-500 opacity-65'>
              <ul className='text-3xl'>
                <li>Effiency</li> 
                <li>Clean Invoices</li> 
                <li>Cost Efficient</li> 
                <li>Workplace Facilitation</li> 
                <li>Advanced UI</li> 
                <li>Global Partners like Mastercard , Visa , PayPal</li> 
             </ul>
             <Image src={Hero} width={400} height={400} alt='Banner' />
          </div>

    </section>
  )
}

export default Features
