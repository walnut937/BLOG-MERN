import React, { useEffect } from 'react'
import { useState, useRef } from 'react'

export let activeTabLineref;
export let activeTabRef;

function InpageNavigationComponent({ routes,defaultHidden = [], defaultActiveIndex = 0, children }) {

    activeTabLineref = useRef()
    activeTabRef = useRef()

    const [inPageIndex, setinPageIndex] = useState(defaultActiveIndex);

    const changePageState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn;
        activeTabLineref.current.style.width = offsetWidth + "px";
        activeTabLineref.current.style.left = offsetLeft + "px";

        setinPageIndex(i)
    }

    useEffect(() => {
        changePageState(activeTabRef.current, defaultActiveIndex)
    }, [])

  return (
    <>
    <div className='relative mb-8 bg-white  border-grey flex flex-nowrap overflow-x-auto'>
            {
                routes.map((route, i) => {
                    return (
                        <button ref={i === defaultActiveIndex ? activeTabRef : null} key={i} className={`p-4 px-5 capitalize font-medium ${inPageIndex === i ? 'text-black' : 'text-dark-grey'} ${defaultHidden.includes(route) ? "md:hidden" : " "}`} onClick={(e) => {changePageState(e.target, i)}}>{ route }</button>
                    )
                })
            }
            <hr ref={activeTabLineref} className='absolute bottom-0 duration-300 h-[1px] bg-dark-grey' />
    </div>
    { Array.isArray(children) ? children[inPageIndex] : children }
    </>
  )
}

export default InpageNavigationComponent