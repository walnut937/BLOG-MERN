import React from "react";
import { Link } from "react-router-dom";
import Pageanimation from "../common/Pageanimation";
import { useContext } from "react";
import { Usercontext } from "../App";
import { removeFromSession } from "../common/session";

function UserNavigationComponent({ navopen }) {

  const {userAuth : { username }, setUserAuth} = useContext(Usercontext);
  const removeUser = () => {
    removeFromSession("user");
    setUserAuth({access_token : null});
  }
   
  return (
    <Pageanimation transition={{ duration: 0.2 }} className="right-0 absolute z-50">
      <div className={`bg-white ${navopen ? "block" : "hidden"} rounded-lg shadow-2xl p-5 absolute right-0 top-15 border flex flex-col border-grey w-44 overflow-hidden duration-200`}>

        <Link to="/editor" className="flex items-center gap-2 md:hidden pl-8 py-4">
          <i className="fi fi-rr-file-edit"></i>
          <h1>Write</h1>
        </Link>

        <Link to={`/user/${username}`} className="pl-8 py-3 hover:bg-grey rounded-lg">
            Profile
        </Link>

        <Link to="/dashboard/blogs" className="pl-8 py-3 hover:bg-grey rounded-lg">
            Dashboard
        </Link>

        <Link to="/settings/edit-profile" className="pl-8 py-3 hover:bg-grey rounded-lg">
            Settings
        </Link>

        <div className="bg-dark-grey w-full h-[1px] my-1"></div>

        <button onClick={removeUser} className="text-center py-3 hover:bg-grey rounded-lg">
            <h1 className="font-medium">SignOut</h1>
            <h1 className="text-sm overflow-hidden text-ellipsis">@{username}</h1>
        </button>

      </div>
    </Pageanimation>
  );
}

export default UserNavigationComponent;
