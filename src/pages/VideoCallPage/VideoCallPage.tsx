import React from 'react'
import { entrepreneurs } from '../../data/users'
import { investors } from '../../data/users'
import { Link } from 'react-router-dom'

function VideoCallPage() {
    const isInvestor =localStorage.getItem("business_nexus_user")  
    const user = JSON.parse(isInvestor)
    console.log(user);
    
    
  return (
    <div className='flex justify-around '>
        {user.role === "investor" &&
          entrepreneurs.map((entrepreneur)=>(
            <div key={entrepreneur.id} className='flex border-2 gap-3 border-gray-100 w-[250px] p-4 bg-white rounded-md'>
                <div className='flex flex-col justify-between items-stretch'>
                  <div >
                    <h3 className='font-semibold'>{entrepreneur.name}</h3>
                     <p className='text-gray-500 '>{entrepreneur.role}</p>
                  </div>
                  <Link to="/videocall" className='bg-green-400  py-1 px-2 text-white rounded'>Video Call</Link>
                </div>
                <img src={entrepreneur.avatarUrl} alt="" style={{
                    width:"100px",
                    height:"100px",
                    borderRadius:"50%"
                }} />
            </div>
          ))
        }  
        {
            user.role === "entrepreneur" &&
            investors.map((investor)=>(
                <div key={investor.id} className='flex border-2 gap-3 border-gray-100 w-[250px] p-4 bg-white rounded-md'>
                <div className='flex flex-col justify-between items-stretch'>
                  <div >
                    <h3 className='font-semibold'>{investor.name}</h3>
                     <p className='text-gray-500 '>{investor.role}</p>
                  </div>
                  <Link to="/videocall" className='bg-green-400  py-1 px-2 text-white rounded'>Video Call</Link>
                </div>
                <img src={investor.avatarUrl} alt="" style={{
                    width:"100px",
                    height:"100px",
                    borderRadius:"50%"
                }} />
            </div>
            ))
        }   
    </div>
  )
}

export default VideoCallPage
