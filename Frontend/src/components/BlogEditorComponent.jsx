import React, { useEffect }  from 'react'
import Pageanimation from '../common/Pageanimation'
import { Link, useNavigate } from 'react-router-dom'
import  logo  from '../imgs/logo.png'
import defaultbanner from '../imgs/blog banner.png'
import { UploadImage } from '../common/aws'
import { Toaster, toast } from 'react-hot-toast'
import { useContext } from 'react'
import { EditorContext } from '../pages/EditorPages'
import EditorJS from '@editorjs/editorjs'
import { tools } from './ToolsComponents'
import axios from 'axios'
import { Usercontext } from '../App'

function BlogEditorComponent() {
    //getting values from ContextAPI
    const { blog, blog: { title, banner, content, tags, des }, setBlog, texteditor, setTextEditor, setEditorstate } = useContext(EditorContext);

    let { userAuth: { access_token } } = useContext(Usercontext);

    let navigate = useNavigate()
    //uploading the image and spliting the URL to see the preview
    const handleBannerUpload = (e) => {
        let img = e.target.files[0]
        if(img) {
            let loadingToast = toast.loading("Uploading...");
            UploadImage(img).then(url => {
                if(url){
                    toast.dismiss(loadingToast);
                    setTimeout(() => {
                        toast.success('Successfully Uploaded');
                    }, 1000);
                    setBlog({ ...blog, banner: url })
                }
            })
            .catch(err =>  {
                toast.dismiss(loadingToast);
                return toast.error(err);
            })
        }
    }

    //rejecting the enter button
    const handleTitleKeyDown = (e) => {
        if(e.keyCode === 13){
            e.preventDefault();
        }
    }
    
    //title height changing
    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
        setBlog({ ...blog, title: input.value })
    }

    // imgerror for defaultbanner
    const handleError = (e) => {
        let img = e.target;
        img.src = defaultbanner;
    }

    //TextEditor configuration 
    useEffect(() => {
        if(!texteditor.isReady){
            setTextEditor(new EditorJS({
                holder: "textEditor",
                data : content,
                tools: tools,
                placeholder: " Let's write an awesome story "
            }))
        }
    }, [])

    //publish Event
    const handlePublishEvents = () => {
        //checks for banner length
         if(!banner.length){
            return toast.error('Uplaod the banner')
         }

         //checks for title length
         if(title.length < 10){
            return toast.error('Title is too short')
         }

         //checks for content length
         if(texteditor.isReady){
            texteditor.save().then(data => {
                if(data.blocks.length){
                    setBlog({...blog, content: data});
                    setEditorstate('Publish');
                }else{
                    return toast.error('Content is Empty')
                }
            })
            .catch(err => {
                console.log(err)
            })
         }
    }


    //Draft Button
    const handleDraftEvent = (e) => {
        if(e.target.className.includes('disable')){
            return ;
          }
      
          if(!title.length){
            return toast.error("Provide Title before saving it as draft")
          }
      
          let loadingtoast = toast.loading("Publishing...")
          e.target.classList.add('disable')
          
          if(texteditor.isReady){
            texteditor.save().then( content => {
                let blogObj = {
                  title, banner, content, des, tags, draft: true
                }

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
                    headers: {
                      'Authorization' : `Bearer ${access_token}` 
                    }
                  })
                  .then(() => {
                    e.target.classList.remove('disable')
                    toast.dismiss(loadingtoast)
                    toast.success("Saved 👍")
                    setTimeout(() => {
                      navigate("/")
                    }, 500);
                  })
                  .catch(({ response }) => {
                    e.target.classList.remove('disable')
                    toast.dismiss(loadingtoast)
                    return toast.error(response.data.error)
                  })
            })
          }
    }


  return (
    <>
    {/* nav */}
        <nav className='navbar justify-between'>
        <div className='flex items-center gap-8'>
            <Link to="/"  className='w-12 flex-none'>
            <img src={logo} alt="logo" className='w-full' />
            </Link>
            <h1 className='font-medium hidden md:block text-black line-clamp-1'>{title || 'New Blog'}</h1>
        </div>
        <div className='flex items-center gap-4 md:gap-8'>
            <button to="signin" onClick={handlePublishEvents} className='bg-black text-white rounded-2xl px-3 py-2 cursor-pointer'>
            <h1>Publish</h1>
            </button>
            <button to="signup" onClick={handleDraftEvent} className='bg-grey px-3 py-2 rounded-2xl cursor-pointer'>
            <h1>Save Draft</h1>
            </button>
        </div>
        </nav>

        <Toaster />
        <Pageanimation>
            <section>
        {/* imgUpload */}
                <div className='mx-auto max-m-[900px] w-full'>
                    <div className='relative aspect-video rounded-2xl bg-white border-grey border-4'>
                        <label htmlFor="uploadBanner">
                            <img className='z-20 rounded-lg hover:opacity-80 transition-all duration-500' src={banner} onError={handleError} alt="banner Image" />
                            <input type="file" id='uploadBanner' accept='.png, .jpeg, .jpg' hidden onChange={handleBannerUpload} />
                        </label>
                    </div>
                </div>

        {/* textarea */}
            <textarea defaultValue={title} placeholder='Blog Title' className='mx-auto max-m-[900px] w-full mt-10 outline-none resize-none h-20 text-4xl placeholder:opacity-40 font-medium' onKeyDown={handleTitleKeyDown} onChange={handleTitleChange}></textarea>


            <hr className='opacity-10' />

            <div id='textEditor' className='w-full mx-auto max-m-[900px]'></div>

            </section>
        </Pageanimation>

    </>
  )
}

export default BlogEditorComponent