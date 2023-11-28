import React, { useState } from 'react'

function InputComponent({ name, type, placeholder, id, value, icon}) {

    const [eyeopen , setEyeOpen] = useState(false)
    
  return (
    <div className='relative w-[100%] mb-4'>
        <i className={`${icon} absolute left-[23%] top-1/2 -translate-y-1/2`}></i>
        <input
        className={`p-2 bg-grey rounded-md pl-12`}
        name={name} type={type === 'password' ? eyeopen ? 'text' : 'password' : type} placeholder={placeholder} defaultValue={value} id={id} />

        {type == 'password' ?  <i onClick={() => setEyeOpen(!eyeopen)} className={`${eyeopen ? 'fi fi-rr-eye' : 'fi fi-rr-eye-crossed'} absolute right-[23%] cursor-pointer top-1/2 -translate-y-1/2`} ></i> : <></>}
    </div>
  )
}

export default InputComponent