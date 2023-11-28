// // utils/userUtils.js
// import jwt from "jsonwebtoken";
// import User from "../Schema/User.js";

//   export const generateUsername =  async (email) => {
//     let username = email.split('@')[0];
//     let UsernameExists = await User.exists({"personal_info.username" : username}).then(result => result);
//     UsernameExists ? username += nanoid().substring(0, 5) : "";
//     return username;
//   }
//   export const formatDatatosend = (user) => {
//     const access_token = jwt.sign({ id: user._id }, process.env.JWTTOKEN) 

//     return {
//         access_token,
//         profile_img: user.personal_info.profile_img,
//         username: user.personal_info.username,
//         fullname: user.personal_info.fullname,
//     }
//   }                                    
