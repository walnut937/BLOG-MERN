//imports
import logo from '../imgs/logo.png'
import { Link } from 'react-router-dom'
import { useContext, useState } from 'react';
import { Usercontext } from '../App';
import UserNavigationComponent from './UserNavigationComponent';

function navbarComponent() {

  const { userAuth, userAuth: { access_token, profile_img } } = useContext(Usercontext);

  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [navopen, setNavopen] = useState(false);

  const handleblur = () => {
    setTimeout(() => {
      setNavopen(false);
    }, 200);
  }

  return (
    <nav className="navbar">

      {/* logo */}
      <Link to="/"  className='w-12 flex-none'>
        <img src={logo} alt="logo" className='w-full' />
      </Link>

      {/* inputbox */}
      <div className={`absolute ${searchBoxVisibility ? '' : 'hidden pointer-events-auto'} md:block md:border-0 md:relative md:inset-0 md:pl-0 bg-white w-full top-full mt-0.5 left-0 border-grey border-b border-[1px] py-4 px-[5vw] md:w-auto`}>
          <input type="text" placeholder='Search' className='w-full md:w-auto bg-grey p-4 rounded-full placeholder:text-dark-grey pl-6 pr-[12%] md:pr-6 md:pl-12' />
          <i className="fi fi-rr-search md:pointer-events-none absolute right-[10%] md:left-5 top-1/2 -translate-y-1/2"></i>
      </div>

      {/* searchicon */}
      <div onClick={() => setSearchBoxVisibility(!searchBoxVisibility)} className='flex items-center gap-3 ml-auto md:hidden'>
          <button className='bg-grey rounded-full w-12 h-12 flex justify-center items-center'><i className="fi fi-rr-search md:hidden text-xl "></i></button>
      </div>

      {/* EditButton */}
      <Link to="editor" className='md:flex hidden ml-auto gap-2 hover:bg-grey px-3 py-2 rounded-md cursor-pointer'>
      <i className="fi fi-rr-file-edit"></i>
      <h1>Write</h1>
      </Link>

      {
        access_token ? 
        <>
        <Link to="/dashboard/notification">
          <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/30'>
            <i className='fi fi-rr-bell text-xl'></i>
          </button>
        </Link>
        <div onClick={() => setNavopen(!navopen)} onBlur={handleblur} className='relative rounded-full'>
          <button className='w-12 h-12'>
            <img src={profile_img} className='w-full rounded-full cursor-pointer object-cover' alt="" />
          </button>
          <UserNavigationComponent navopen={navopen} />
        </div>
        </>
        : 
        <>
        {/* signup */}  
        <Link to="signin" className='bg-black text-white rounded-2xl px-3 py-2 cursor-pointer'>
          <h1>Sign In</h1>
        </Link>

        {/* Login */}
        <Link to="signup" className='bg-grey px-3 py-2 rounded-2xl hidden md:block cursor-pointer'>
          <h1>Sign Up</h1>
        </Link>
        </>
      }


    </nav>
  )
}

export default navbarComponent