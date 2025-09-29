import React from 'react'
import {  FaGithub, FaLinkedin } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '/public/logo.png'



const Footer = () => {
  return (
    <footer >
        <div className='flex items-center justify-between p-4 bg-white'>
              <div className='font-semibold opacity-80'>
                  <div className="flex items-center">
                        <Image src={Logo} alt='Logo' width={40} height={40}/>  
                        <span>Invoice</span>
                        <span className='text-blue-400'>Flow</span>  
                  </div>
                <p className='px-3'>gradipuata@gmail.com</p>
          </div>
          <div className='flex justify-around gap-x-3'>
              <div>
                  <Link href='https://github.com/codewithgradi' target='_blank'>
                        <FaGithub />
                  </Link>
             </div>
              <div>
                  <Link href='https://www.linkedin.com/in/gradi-puata/' target='_blank'>
                        <FaLinkedin />
                  </Link>
             </div>
          </div>      
        </div>
        <p className='text-center font-semibold bg-blue-200 p-1 opacity-70'>Developed by Gradi Puata &copy; Copyrights are Reserved</p>
    </footer>
  )
}

export default Footer
