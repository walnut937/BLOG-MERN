import React, { createContext, useState } from 'react'
import { useContext } from 'react'
import { Usercontext } from '../App'
import { Navigate } from 'react-router-dom';
import BlogEditorComponent from '../components/BlogEditorComponent';
import PublishFormComponent from '../components/PublishFormComponent';

const blogStructure = {
  title : '',
  banner: '',
  content: [],
  tags: [],
  des: '',
  author: { personal_info: { } }
}

export const EditorContext = createContext({})

function EditorPages() {
    const [ blog, setBlog ] = useState(blogStructure) 
    const [ editorstate, setEditorstate ] = useState("editor");
    const [ texteditor, setTextEditor ] = useState({ isReady: false })
    const { userAuth : { access_token }, setUserAuth } = useContext(Usercontext);
  return (
        <EditorContext.Provider value={{ blog, setBlog, editorstate, setEditorstate, texteditor, setTextEditor }}>
          {
            access_token == null ? <Navigate to="/signin" /> : editorstate == "editor" ? <BlogEditorComponent /> : <PublishFormComponent />
          }
        </EditorContext.Provider>
  )
}

export default EditorPages