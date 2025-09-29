
import React from 'react'
import Logo from '/public/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'

const Navbar = async () => {
    
  return (
      <nav className='container flex items-center justify-between'>
          <Link href='/' className='flex items-center '>
              <Image src={Logo} alt='Company Logo' width={60} height={60} />
              <div className='font-bold text-gray-800 '>
                  <span>Invoice</span>
                  <span className='text-blue-300'>Flow</span>
              </div>
          </Link>
          <div className=' flex gap-x-8 items-center font-semibold '>
              <Link href='/generate'>
              <Button>Get Started Today</Button>        
            </Link>
        </div>
    </nav>
  )
}

export default Navbar
