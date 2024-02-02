import { useState, useEffect } from 'react'
import './tempstyles.css'

const page = () => {

  return (
    <div className='container'>
      <h1>Page to test playing videos</h1>
      <button className='inputs'>Play video</button>
      <video src={'/devMedia/LSep2.mp4'} controls></video>
    </div>
  )
}

export default page