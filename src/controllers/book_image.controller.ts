import {PrismaClient} from "@prisma/client";
import multer from 'multer';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client,PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {GetObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import crypto from 'crypto';
import sharp from 'sharp';

const prisma=new PrismaClient();
dotenv.config()

const randomImageName=(bytes=32)=>crypto.randomBytes(bytes).toString('hex')


const BUCKET_NAME=process.env.BUCKET_NAME
const BUCKET_REGION=process.env.BUCKET_REGION
const ACCESS_KEY=process.env.ACCESS_KEY
const SECRET_ACCESS_KEY=process.env.SECRET_ACCESS_KEY

const s3=new S3Client({
    credentials:{
        accessKeyId:ACCESS_KEY,
        secretAccessKey:SECRET_ACCESS_KEY,
    },
    region:BUCKET_REGION
});
const storage=multer.memoryStorage()
const upload=multer({storage: storage})

export const multipleUploadFiles=upload.array('bookImage',5);
export const postImage=async(req,res)=>{
    try{
        const uploadImage=req.files;
        const bookId=req.body.bookId;
        
        if(!uploadImage || uploadImage.length==0){
            return res.status(400).json({message:"No files were uploaded"});
        }
        
        // req.files.buffer
        const file=req.files[0];
        console.log("DEBUG: BUCKET_NAME, BUCKET_REGION:", BUCKET_NAME, BUCKET_REGION);
        console.log("DEBUG: file keys:", {
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        bufferLength: file.buffer ? file.buffer.length : null
        });

        const buffer=await sharp(file.buffer).resize({height:1920,width:1080,fit:"contain"}).toBuffer();
        const imageName=randomImageName();
        const params={
            Bucket:BUCKET_NAME,
            Key:randomImageName(),
            Body:buffer,
            ContentType:file.mimetype,
        }

        const command=new PutObjectCommand(params)
        try{
            const result=await s3.send(command);
            console.log("AWS Successful",result);

            const post=await prisma.bookImage.create({
                data:{
                    image:imageName,
                    book:{
                        connect:{
                            id:bookId,
                        }
                    }
                }
            })
        }
        catch(awsErr){
            console.error("AWS s3 error ",awsErr);
            return res.status(500).json({
            message: "S3 upload failed",
            error: awsErr.message || awsErr,
            name: awsErr.name || null,
            $metadata: awsErr.$metadata || null
          });
        }
        res.status(200).json({
            message:"Successful",
            files:uploadImage.map(f=>({
                name:f.originalname,
                size:f.size,
                mimetype:f.mimetype,
                buffer:f.buffer.toString("base64"),
            }))
        });


    }
    catch(e){
        throw new Error("Unable to post");
    }
}


export const getImage=async(req,res)=>{
    try {
    const posts = await prisma.bookImage.findMany({
      orderBy: [{ bookId: 'desc' }],
    });

    const postsWithUrls = await Promise.all(
      posts.map(async (post) => {
        const getObjectParams = { Bucket: BUCKET_NAME, Key: post.image };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return { ...post, imageUrl: url };
      })
    );

    return res.status(200).json({ posts: postsWithUrls }); // <<-- actually send JSON
  } catch (err) {
    console.error("getImage error:", err);
    return res.status(500).json({ message: "Unable to fetch images", error: err.message || err });
  }
} 

export const deleteImage=async(req,res)=>{
    try{
        const id=req.params.id;

        const post=await prisma.bookImage.findUnique({
            where:{id}
        })
        if(!post){
            res.status(404).send("post not found");
        }

        const params={
            Bucket:BUCKET_NAME,
            Key:post.image,
        }

        const command=new DeleteObjectCommand(params)
        await s3.send(command)
        await prisma.bookImage.delete({where:{id}})
        return res.status(200).json({
            message:'data deleted successfully'
        })
    }
    catch(e){
        throw new Error("Error occured");
    }
}