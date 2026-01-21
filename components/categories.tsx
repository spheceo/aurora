import React from 'react'
import Image from 'next/image'

const categories = ({ data }: { data: string }) => {
  return (
    <div className="bg-black relative overflow-hidden h-dvh z-30">
        <div className=' flex-col justify-center items-center relative z-20 my-[40px]'>
            <div className="flex justify-between items-center mx-[73px] text-[#c1c2c2]">
                <p className=" text-[20px] text-start font-medium">Pieces defined by natural beauty, vibrant<br/> energy, and a refined sense of timeless elegance.</p>
                <h1 className="text-[50px] font-medium w-[234px]">Shop By Intention</h1>
            </div>
        </div>
    </div>
  )
}

export default categories