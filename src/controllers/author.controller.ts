import { PrismaClient } from "@prisma/client";
console.log("Prisma import OK");
new PrismaClient();
// import {PrismaClient} from "../generated/prisma/client";
const authorClient=new PrismaClient().author;

// getAllAuthor
export const getAllAuthors=async(req,res)=>{
    try{
        const allAuthors=await authorClient.findMany({
            include:{
                books:true,
            }
        })
        res.status(200).json({data:allAuthors})
    }
    catch(e){
        throw new Error('error occured');
    }
}
// getAuthorById

export const getAuthorById=async (req,res)=>{
    try{
        const authorId=req.params.id;
        const author=await authorClient.findUnique({
            where:{
                id:authorId,
            },
            include:{
                books:true,
            }
        })
        res.status(200).json({data:author});
    }   
    catch(e){
        console.error("Error: ",e);
    }
}
// createAuthor
export const createAuthor=async(req,res)=>{
    try{
        const authorData=req.body;
        const author=await authorClient.create({
            data:authorData,
        });
        res.status(201).json({data:author});
    }
    catch(e){
        console.error('Error: ',e);
    }
}
// updateAuthor
export const updateAuthor=async(req,res)=>{
    try{
        const authorId=req.params.id;
        const authorData=req.body;
        const author=await authorClient.update({
            where:{
                id:authorId,
            },
            data:authorData
        })
        res.status(200).json({data:author});
    }
    catch(e){
        console.error(e);
    }
}
// deleteAuthor

export const deleteAuthor=async(req,res)=>{
    try{
        const authorId=req.params.id;
        const author=await authorClient.delete({
            where:{
                id:authorId,
            },
        });
        res.status(200).json({});
    }
    catch(e){
        console.error(e);
    }
}
