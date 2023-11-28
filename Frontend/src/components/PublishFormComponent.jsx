import React, { useContext } from 'react'
import Pageanimation from '../common/Pageanimation'
import { Toaster, toast } from 'react-hot-toast'
import { EditorContext } from '../pages/EditorPages'
import Tag from './TagsComponents'
import  axios  from 'axios'
import { Usercontext } from '../App'
import { useNavigate } from 'react-router-dom'

function PublishFormComponent() {

  let { blog, blog: { banner, title, tags, des, content }, setEditorstate, setBlog } = useContext(EditorContext)

  let navigate = useNavigate()

  let { userAuth: { access_token } } = useContext(Usercontext);

  //fucntion to change the state to go back to the editor page
  let handleCloseEvent = () => {
    setEditorstate('editor')
  }

  //fucntion to change title State
  const handleBlogTitleChange = (e) => {
    setBlog({ ...blog, title: e.target.value })
  }

  //fucntion to change des State
  const handleBlogDesChange = (e) => {
    setBlog({ ...blog, des : e.target.value })
  }

   //rejecting the enter button
   const handledesKeyDown = (e) => {
    if(e.keyCode === 13){
        e.preventDefault();
    }
  } 

  //fucntion to add tags and its will work while cliking , or enter
  const handleKeyDown = (e) => {
    if(e.keyCode === 13 || e.keyCode === 188){
      e.preventDefault();
      let tag = e.target.value
      if(tags.length < 10){
        if(!tags.includes(tag) && tag.length){
          setBlog({ ...blog, tags: [ ...tags, tag ] })
        }
      }else{
        toast.error('Tags limit reached')
      }
      e.target.value = ''
  }
  }

  //publish button 
  const handlePublish = (e) => {

    if(e.target.className.includes('disable')){
      return ;
    }

    if(!title.length){
      return toast.error("Title is empty")
    }
    if(!des.length || des.length > 150){
      return toast.error("Description should be provided within 200 characters")
    }  
    if(!tags.length || tags.length > 10){
      return toast.error("Enter atleast one tag and maximum is 10 tags")
    }

    let loadingtoast = toast.loading("Publishing...")
    e.target.classList.add('disable')

    let blogObj = {
      title, banner, content, des, tags, draft: false
    }

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
      headers: {
        'Authorization' : `Bearer ${access_token}` 
      }
    })
    .then(() => {
      e.target.classList.remove('disable')
      toast.dismiss(loadingtoast)
      toast.success("Published 👍")
      setTimeout(() => {
        navigate("/")
      }, 500);
    })
    .catch(({ response }) => {
      e.target.classList.remove('disable')
      toast.dismiss(loadingtoast)
      return toast.error(response.data.error)
    })
  }

  return (
    <Pageanimation>
      <section className='w-screen min-h-screen grid lg:grid-cols-2 grid-cols-1 items-center py-16 lg:gap-4'>
        <Toaster />

          {/* backnavigation button */}
          <button onClick={handleCloseEvent} className='w-12 h-12 absolute right-[5vh] z-10 top-[5%] lg:top-[10%]'>
          <i className="fi fi-br-cross"></i>
          </button>

          {/* BlogPost Preview */}
          <div className='max-w-[550px] center'>
            <p className='text-dark-grey mb-1'>Preview</p>

            <div>
              <img src={ banner } alt="banner Image" className='aspect-video rounded-lg overflow-hidden bg-grey mt-4' />
            </div>

            <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{ title }</h1>

            <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{ des }</p>
          </div>

          {/* changing the blog and desc */}
          <div className='border-grey lg:border-1 lg:pl-8 ml-16'>
            <p className='text-dark-grey mb-2 mt-9'>Blog Title</p>
            <input type="text" placeholder='Blog Title' onChange={handleBlogTitleChange} className='input-box pl-4' defaultValue={title} />

            <p className='text-dark-grey mb-2 mt-9'>Short description about your blog</p>
            <textarea maxLength={200} defaultValue={des} onChange={handleBlogDesChange} onKeyDown={handledesKeyDown} className='h-40 resize-none leading-7 w-full input-box pl-4 line-clamp-2'></textarea>
            <p className='text-right mt-1 text-dark-grey text-sm'>{150 - des.length} characters left</p>

            <p className='text-dark-grey mb-2 mt-9'>Tags - (Helps in searching and raking your blog post)</p>

            <div className='input-box pl-2 pb-4 '>
                <input type="text" placeholder='Tags' className='sticky placeholder:opacity-70 input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white' onKeyDown={handleKeyDown}  />
                {
                  tags.map((tag, i) => {
                    return <Tag key={i} tagindex={i} tag={tag}/>
                  })
                } 
            </div>
            <p className='text-right mt-1 text-dark-grey text-sm'>{ 10 - tags.length } tags left</p>
            <button className='btn-dark px-8' onClick={handlePublish}>Publish</button>
          </div>
      </section>
    </Pageanimation>
  )
}

export default PublishFormComponent