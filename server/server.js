import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from 'bcrypt'
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from 'cors'
import admin from 'firebase-admin' 
import  ServiceAccountkey  from "./mern-blog--auth-firebase-adminsdk-5mnx4-c1fc062151.json" assert { type: "json" };
import { getAuth } from 'firebase-admin/auth'
import aws from 'aws-sdk'


//schemas
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js"

const server = express();

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


//mongoose connection
mongoose.connect(process.env.MONGODB_URI, { autoIndex: true });


//setting up S3 bucket
const s3 = new aws.S3({
    region: 'ap-south-1',
    accessKeyId : process.env.AWS_ACCESS_KEYID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY  
})

const generateUploadURL = async () => {
    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;
    return await s3.getSignedUrlPromise('putObject', {
        Bucket : 'blogsspace',
        Key: imageName,
        Expires: 1000,
        ContentType: "image/jpeg"
    })
}

// properties to use by express
server.use(express.json({ limit: "100kb" }));
server.use(cors())

//JWT middleware 
const verifyJWT = ( req, res, next ) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        return res.status(401).json({ error: "No access token " })
    }

    jwt.verify(token, process.env.JWTTOKEN, ( err, user ) => {
        if(err){
            return res.status(403).json({ error : "Invalid Access Token" })
        }

        req.user = user.id
        next();
    })
}




//data to send in frontend
const formatDatatosend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.JWTTOKEN) 

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
    }
}

//func to check uniquness of username
const generateUsername = async(email) => {
    let username = email.split('@')[0];
    let UsernameExists = await User.exists({"personal_info.username" : username}).then(result => result);
    UsernameExists ? username += nanoid().substring(0, 5) : "";
    return username;
}


//uploadImage URL route
server.get('/get-upload-url', (req, res) => {
    generateUploadURL().then(url => res.status(200).json({"uploadURL" : url}))
    .catch(err => {
        console.log(err.message)
        return res.status(500).json({error : err.message})
    })
})



//main signup function
server.post("/signup", async(req, res) => {
  let { fullname, email, password } = req.body;
  //validation
  if (fullname.length < 3) {
    return res.status(403).json({error: "Full name must be 3 letters long" });
  }

  if(!email.length){
    return res.status(403).json({error: "Please enter your email address"})
  }

  if(!emailRegex.test(email)){
    return res.status(403).json({error: "Email is invalid"})
  }

  if(!passwordRegex.test(password)){
    return res.status(403).json({error: "Password must contain 1 Uppercase, 1 lowercases and 1 numbers and 6- 20 characters long"})
  }

  bcrypt.hash(password, 10, async(err, hashed_password) => {
    let username = await generateUsername(email);

    let user = new User({
        personal_info: { fullname, email, password: hashed_password, username }
    });

    user.save()
    .then((data) => {
        return res.status(200).json(formatDatatosend(data));
    })
    .catch((err) => {
        if(err.code == 11000){
            return res.status(500).json({ error: "Email already exist"})
        }
        return res.status(500).json({error : err.message})
    })
  })

//   return res.status(200).json({ status: "Ok" });
});



// main signin function
server.post('/signin', (req,res) => {
    let { email, password } = req.body
    User.findOne({"personal_info.email" : email})
    .then((user) => {
        if(!user){
            return res.status(403).json({error: "Email not found"})
        }

        if(user.google_auth){
            return res.status(403).json({error: "This email was logged in using google"})
        }

        bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if(err){
                return res.status(403).json({ error: "Error occured while signing in please try again later"})
            }
            if(!result){
                return res.status(403).json({error: "Password is incorrect"})
            }else{
                return res.status(200).json(formatDatatosend(user))

            }
        })


        // console.log(user)
        // return res.json({"status": "got user document"})
    })
    .catch((err) => {
        console.log("got wrong")
        return res.status(403).json({Error: "got wrong"})
    })
})


//google authentication
server.post("/google-auth", async(req, res) => {
    let { access_token } = req.body
    getAuth().verifyIdToken(access_token)
    .then( async(decodedUser) => {
        console.log(decodedUser, "done")
        let { email, name, picture } = decodedUser
        picture = picture.replace("s96-c", "s384-c")
        let user = await User.findOne({"personal_info.email" : email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then(u => {
            return u || null;
        })
        .catch(err => {
            return res.status(500).json({error : "user not found"})
        })
        
        if(user){
            if(!user.google_auth){
                console.log(user)
                return res.status(403).json({error : "This user is signed up without google, Please login with password"})
            }
        }
        //signup
        else{
            let username = await generateUsername(email);
            user = new User({personal_info: {fullname: name , username, email }, google_auth: true})
            
            await user.save().then(u => {
                user = u;
            })
            .catch(err => {
                return res.status(500).json({error : err.message})
            })
        }
        // console.log(user)
        return res.status(200).json(formatDatatosend(user));

    })
    .catch(err => {
        return res.status(500).json({error: "failed to autheticate with google try something else"})
    })
})


//Getting latest Blogs for Home Page
server.get('/latest-blogs', (req, res) => {

    let maxlimit = 10;
    
    Blog.find({draft : false})
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "publishedAt": -1 })
    .select("blog_id title banner des content tags activity publishedAt -_id")
    .limit(maxlimit)
    .then(blog => {
        return res.status(200).json({ blog })
    })
    .catch(err => {
        return res.status(500).json({ error : err.message })
    })
})


//Getting latest Blogs for Home Page
server.get('/trending-blogs', (req, res) => {
    
    Blog.find({draft : false})
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "activity.total_reads" : -1, "activity.total_likes" : -1, "publishedAt" : -1})
    .select("blog_id title publishedAt -_id")
    .limit(5)
    .then(blog => {
        return res.status(200).json({ blog })
    })
    .catch(err => {
        return res.status(500).json({ error : err.message })
    })
})



// JWT verfication Middleware
server.post('/create-blog', verifyJWT, (req, res) => {
    let authorId = req.user;

    //desctructuring
    const { title, des, content, tags, banner, draft } = req.body
   
    //validation
    if(!title.length){
        return res.status(401).json({ error: "You must provide a title" })
    }

    if(!draft){
        if(!banner.length){
            return res.status(403).json({ error: "You must provide a banner" })
        }
        if(!des.length || des.length > 150){
            return res.status(403).json({ error: "You must provide description within 150 characters " })
        }
        if(!tags.length || tags.length > 10){
            return res.status(403).json({ error: "You must provide tags and maximum is 10" })
        }
        if(!content.blocks.length){
            return res.status(403).json({ error : "You must provide the description" })
        }
    }
    
    
    // connverting the tags from anycase to lowercase
    const updatedtags = tags.map(tag => tag.toLowerCase())

    // we dont want to give the name of the blog as id so changed it to the title name and if the title have any special characters then replacing them into spaces and after that changing the spaces into hypens]
    let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();

    let blog = new Blog({
        title, des, banner, tags : updatedtags, content, author: authorId, blog_id, draft : Boolean(draft) 
    })

    blog.save().then(eachblog => {

        let increamentval = draft ? 0 : 1;

        User.findOneAndUpdate({ _id : authorId }, { $inc: { "account_info.total_posts" : increamentval }, $push: { "blogs" : eachblog._id } })
        .then(user => {
            return res.status(200).json({ id: eachblog.blog_id })
        })
        .catch(err => {
            return res.status(500).json({ error: "Failed to update total post number" })
        })
    })
    .catch(err => {
        return res.status(500).json({ error: err.message })
    })

    // return res.status(200).json({ "id" : blogId })


})

//searching blogs from search and categories
server.post('/search-blogs', (req, res) => {

    let { tag } = req.body  

    let findQuery = { tags : tag, draft: false };

    let maxlimit = 5;

    Blog.find(findQuery)
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "publishedAt": -1 })
    .select("blog_id title banner des content tags activity publishedAt -_id")
    .limit(maxlimit)
    .then(blog => {
        return res.status(200).json({ blog })
    })
    .catch(err => {
        return res.status(500).json({ error : err.message })
    })

})


//listening the server
server.listen(process.env.PORT, () => {
  console.log(`Server is listening at port ${process.env.PORT}`);
});
