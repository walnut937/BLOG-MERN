// // controllers/UploadController.js
// import aws from 'aws-sdk';
// import { nanoid } from "nanoid";

// const s3 = new aws.S3({
//   region: 'ap-south-1',
//   accessKeyId: process.env.AWS_ACCESS_KEYID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// const UploadController = {
//   getUploadURL: async (req, res) => {
//     try {
//       const date = new Date();
//       const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

//       const uploadURL = await s3.getSignedUrlPromise('putObject', {
//         Bucket: 'blogsspace',
//         Key: imageName,
//         Expires: 1000,
//         ContentType: "image/jpeg"
//       });

//       res.status(200).json({ uploadURL });
//     } catch (error) {
//       console.log(error.message);
//       res.status(500).json({ error: error.message });
//     }
//   },
// };

// export default UploadController;
