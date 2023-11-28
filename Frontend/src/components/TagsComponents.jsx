import React, { useContext } from 'react'
import { EditorContext } from '../pages/EditorPages'

function Tag({ tag, tagindex }) {
  const { blog, blog: { tags }, setBlog } = useContext(EditorContext)


  //function to set the focus on the tag after clicking
  const contentEditable = (e) => {
    e.target.setAttribute("contenteditable", true)
    e.target.focus();
  }

  //function to delete the tag from the array and store in new array
  const handleTagDelete = () => {
    const updatedtags = tags.filter(t => t !== tag)
    setBlog({ ...blog, tags : updatedtags })
  }

  //function to change the tag name directly and store in state
  const handleTagEdit = (e) => {
    if(e.keyCode == 13 || e.keyCode == 188){
      e.preventDefault();
      let currentTag = e.target.innerText;
      tags[tagindex] = currentTag;
      setBlog({ ...blog, tags })
      e.target.setAttribute("contenteditable", false)
    }
  }

  return (
    <div className='relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block bg-opacity-50 pr-8 '>
        <p className='outline-none' onKeyDown={handleTagEdit} onClick={contentEditable}>{tag}</p>
        <button className='absolute right-2 top-[17px] -translate-x-1/2 -translate-y-1/2' onClick={handleTagDelete} >
        <i className="fi fi-br-cross text-[7px]"></i>
        </button>
    </div>
  )
}

export default Tag