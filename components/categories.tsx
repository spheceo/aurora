import React from 'react'
import Image from 'next/image'

const cards = [
  {key: 1, label: "Love & Relationships", image: "/categories/loveandselfcare.png", description: "Pieces defined by natural beauty, vibrant energy, and a refined sense of timeless elegance."},
  {key: 2, label: "Prosperity & Abundance", image: "/categories/abundanceandsuccess.png", description: "Pieces defined by natural beauty, vibrant energy, and a refined sense of timeless elegance."},
  {key: 3, label: "Protection & Grounding", image: "/categories/protection.png", description: "Pieces defined by natural beauty, vibrant energy, and a refined sense of timeless elegance."},
  {key: 4, label: "Anxiety & Stress Relief", image: "/categories/clarityandfocus.png", description: "Pieces defined by natural beauty, vibrant energy, and a refined sense of timeless elegance."},
  {key: 5, label: "Spiritual Growth", image: "/categories/calmandanxietyrelief.png", description: "Pieces defined by natural beauty, vibrant energy, and a refined sense of timeless elegance."},
]

const categories = ({ data }: { data: string }) => {
  return (
    <div className="bg-black relative overflow-hidden h-dvh z-30">
        <div className=' flex-col justify-center items-center relative z-20 my-[40px]'>
            <div className="flex justify-between items-center mx-[73px] text-[#c1c2c2]">
                <p className=" text-[20px] text-start font-medium">Pieces defined by natural beauty, vibrant<br/> energy, and a refined sense of timeless elegance.</p>
                <h1 className="text-[50px] font-medium w-[234px]">Shop By Intention</h1>
            </div>
            <div className='flex items-center mx-[60px] justify-between mt-10'>
              {cards.map((card) => (
                <div key={card.key} className="flex flex-col items-center mt-8 overflow-hidden relative rounded-t-2xl">
                  <Image
                    src={card.image}
                    alt={card.label}
                    width={300}
                    height={300}
                    className='w-[260px] h-[200px] rounded-t-2xl object-cover transition-transform duration-700 ease-out hover:scale-105 z-10'
                  />
                  <div className='bg-[#1e1e1e] w-[260px] items-center justify-center flex flex-col rounded-b-2xl gap-1 z-20'>
                    <p className="text-[#999A9A] mt-6 text-[16px] font-semibold">{card.label}</p>
                    <p className='text-[#727270] text-center mb-6 text-[10px] mx-4 font-medium'>{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
    </div>
  )
}

export default categories