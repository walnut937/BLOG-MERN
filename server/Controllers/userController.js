// // controllers/UserController.js
// import bcrypt from 'bcrypt';
// import User from "../Schema/User.js";
// import { generateUsername, formatDatatosend } from "../Utils/userUtils.js";
// import { getAuth } from 'firebase-admin/auth';

// const UserController = {
//   signup: async (req, res) => {
//     let { fullname, email, password } = req.body;
//     //validation
//     if (fullname.length < 3) {
//       return res.status(403).json({error: "Full name must be 3 letters long" });
//     }
  
//     if(!email.length){
//       return res.status(403).json({error: "Please enter your email address"})
//     }
  
//     if(!emailRegex.test(email)){
//       return res.status(403).json({error: "Email is invalid"})
//     }
  
//     if(!passwordRegex.test(password)){
//       return res.status(403).json({error: "Password must contain 1 Uppercase, 1 lowercases and 1 numbers and 6- 20 characters long"})
//     }
  
//     bcrypt.hash(password, 10, async(err, hashed_password) => {
//       let username = await generateUsername(email);
  
//       let user = new User({
//           personal_info: { fullname, email, password: hashed_password, username }
//       });
  
//       user.save()
//       .then((data) => {
//           return res.status(200).json(formatDatatosend(data));
//       })
//       .catch((err) => {
//           if(err.code == 11000){
//               return res.status(500).json({ error: "Email already exist"})
//           }
//           return res.status(500).json({error : err.message})
//       })
//     })
//   },

//   signin: async (req, res) => {
//     let { email, password } = req.body
//     User.findOne({"personal_info.email" : email})
//     .then((user) => {
//         if(!user){
//             return res.status(403).json({error: "Email not found"})
//         }
//         if(user.google_auth){
//             return res.status(403).json({error: "This email was logged in using google"})
//         }

//         bcrypt.compare(password, user.personal_info.password, (err, result) => {
//             if(err){
//                 return res.status(403).json({ error: "Error occured while signing in please try again later"})
//             }
//             if(!result){
//                 return res.status(403).json({error: "Password is incorrect"})
//             }else{
//                 return res.status(200).json(formatDatatosend(user))

//             }
//         })


//         // console.log(user)
//         // return res.json({"status": "got user document"})
//     })
//     .catch((err) => {
//         console.log("got wrong")
//         return res.status(403).json({Error: err.found})
//     })
//   },

//   googleAuth: async (req, res) => {
//     let { access_token } = req.body
//     getAuth().verifyIdToken(access_token)
//     .then( async(decodedUser) => {
//         console.log(decodedUser, "done")
//         let { email, name, picture } = decodedUser
//         picture = picture.replace("s96-c", "s384-c")
//         let user = await User.findOne({"personal_info.email" : email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then(u => {
//             return u || null;
//         })
//         .catch(err => {
//             return res.status(500).json({error : "user not found"})
//         })
        
//         if(user){
//             if(!user.google_auth){
//                 console.log(user)
//                 return res.status(403).json({error : "This user is signed up without google, Please login with password"})
//             }
//         }
//         //signup
//         else{
//             let username = await generateUsername(email);
//             user = new User({personal_info: {fullname: name , username, email }, google_auth: true})
            
//             await user.save().then(u => {
//                 // console.log(u)
//                 user = u;
//             })
//             .catch(err => {
//                 return res.status(500).json({error : err.message})
//             })
//         }
//         // console.log(user)
//         return res.status(200).json(formatDatatosend(user));

//     })
//     .catch(err => {
//         return res.status(500).json({error: "failed to autheticate with google try something else"})
//     })
//   },
// };

// export default UserController;
