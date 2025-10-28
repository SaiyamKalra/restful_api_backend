import { PrismaClient } from "@prisma/client";
// import {PrismaClient} from "../generated/prisma/client";
const bookClient=new PrismaClient().book;

// getAllBooks
export const getAllBooks=async(req,res)=>{
    try{
        const allBooks=await bookClient.findMany({})
        res.status(200).json({data:allBooks})
    }
    catch(e){
        throw new Error('error occured');
    }
}
// getBooksById

export const getBooksById=async (req,res)=>{
    try{
        const bookId=req.params.id;
        const book=await bookClient.findUnique({
            where:{
                id:bookId,
            },
        })
        res.status(200).json({data:book});
    }   
    catch(e){
        console.error("Error: ",e);
    }
}
// createBook
export const createBook=async(req,res)=>{
    try{
        const BookData=req.body;
        const book=await bookClient.create({
            data:BookData,
        });
        res.status(201).json({data:book});
    }
    catch(e){
        console.error('Error: ',e);
    }
}
// updateAuthor
export const updateBook=async(req,res)=>{
    try{
        const bookId=req.params.id;
        const bookData=req.body;
        const book=await bookClient.update({
            where:{
                id:bookId,
            },
            data:bookData
        })
        res.status(200).json({data:book});
    }
    catch(e){
        console.error(e);
    }
}
// deleteBook

export const deleteBook=async(req,res)=>{
    try{
        const bookId=req.params.id;
        const book=await bookClient.delete({
            where:{
                id:bookId,
            },
        });
        res.status(200).json({});
    }
    catch(e){
        console.error(e);
    }
}
