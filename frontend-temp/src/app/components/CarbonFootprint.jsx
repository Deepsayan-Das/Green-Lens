import React from 'react'

function CarbonFootprint() {
  return (
    <div className='h-screen w-full bg-[#A5D6A7] flex flex-col justify-between items-center'>
        <div className='h-full w-full flex justify-between items-center '>
                   <div className='desc-sec h-[60%] w-[45%] flex flex-col justify-evenly items-start pl-8'>
                <h1 className='text-5xl font-bold uppercase text-[#212121]'>
                    Your Footprint Tells a Story.
                </h1>
                <p className='text-2xl font-medium text-[#4E4E4E]'>
                    Every meal, drive, flight, and click releases carbon into the atmosphere.
                    Your carbon footprint measures how much greenhouse gas you produce through daily life.
                    Understanding it is the first step toward change — because what you can measure, you can improve.
                </p>
                <p className='text-xl font-thin italic text-[#212121]'>
                    Let’s discover where your emissions come from — and how you can balance them.
                </p>
            </div>
            <div className='img-sec h-[70%] w-[45%] bg-[#81C784] mr-8 flex justify-start items-end'>
                <div className='img h-[80%] w-[80%] -ml-8 -mb-8 '
                style={{
                    backgroundImage: `url(/plant.jpeg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    }}
                >

                </div>

            </div>
        </div>
         
            
                    <div className='bottom divider h-[20%] w-full bg-red-transparent'
                    style={{
                    backgroundImage: `url(/wavesOpacity.svg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform:'rotate(180deg)'
                    }}>

                    </div>
    </div>
  )
}

export default CarbonFootprint