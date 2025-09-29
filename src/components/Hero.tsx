import Image from 'next/image'
import React from 'react'
import HeroImage from '/public/headerImage.png'
import { FaBell } from 'react-icons/fa'
import {BiNotepad} from 'react-icons/bi'

const Hero = () => {
  return (
    <section className=' bg-blue-50 p-1'>
          <div className='flex justify-between  items-center px-4 '>
              <div>
                <h1 className='font-bold text-5xl pb-4'>Simpify Your Invoicing</h1>  
                <p className='opacity-65 mb-6'>Effortless, Professional , & Fast</p>
              </div>
             <Image src={HeroImage} width={400} height={400} alt='Banner' />
          </div>
          <div className='grid grid-cols-3 gap-x-7 px-10 mb-1 '>
              <div className="p-10 shadow-lg flex flex-col justify-center items-center bg-white rounded-2xl">
                <FaBell className="text-blue-400" />
                <p className="pt-3 font-semibold opacity-80">Automated Reminders</p>
             </div>
              <div className="p-10 shadow-lg flex flex-col justify-center items-center bg-white rounded-2xl">
                <BiNotepad className="text-blue-400" />
                <p className="pt-3 font-semibold opacity-80">Secure Payments</p>
             </div>
              <div className="p-10 shadow-lg flex flex-col justify-center items-center bg-white rounded-2xl">
                <BiNotepad className="text-blue-400" />
                <p className="pt-3 font-semibold opacity-80">Detailed Reports</p>
             </div>
          </div>
    </section>
  )
}

export default Hero
