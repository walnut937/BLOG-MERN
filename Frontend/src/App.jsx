//imports
import { useState } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import UserAuthFormpage from "./pages/userAuthFormpage";
import Pageanimation from './common/Pageanimation';

//Layout imports
import RootLayout from "./Layouts/RootLayout";
import { createContext, useEffect } from "react";
import { lookInSession } from "./common/session";
import EditorPages from './pages/EditorPages';
import HomePage from './pages/HomePage';



export const Usercontext = createContext({});

const App = () => {

    const [userAuth, setUserAuth] = useState({})

    useEffect(() => {
        let userInSession = lookInSession("user");
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null }) 
    }, [])

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout />}>
                <Route index element={<HomePage />} />
                <Route path="signin" element={<UserAuthFormpage type="Sign In" />} />
                <Route path="signup" element={<UserAuthFormpage type="Sign Up" />} />
                <Route path="editor" element={<EditorPages />} />
            </Route>
        )
    )
    return (
        <Pageanimation>
            <Usercontext.Provider value={{userAuth, setUserAuth}}>
                    <RouterProvider router={router} />
            </Usercontext.Provider>
        </Pageanimation>
    ) 
}

export default App;