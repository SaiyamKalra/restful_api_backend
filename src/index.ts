import 'dotenv/config';
import express from 'express';
import CookieParser from 'cookie-parser';
import bookImageRouter from './routes/book_image.router';
// FIX: Use a dot-slash for files in the same or sub-directory.
import authorRouter from './routes/author.router';
import bookRouter from './routes/book.router';
import cors from 'cors';
import csrf from 'csurf';
const app=express()
// app.options('/delete/:id',cors());// preflight 

// app.use(cors())
const port=process.env.PORT || 8080;

const TRUSTED_ORIGINS=(process.env.TRUSTED_ORIGINS || "").split(',').map(s=>s.trim()).filter(Boolean);
function isTrusted(origin?:string){
    return origin && TRUSTED_ORIGINS.includes(origin);
}

const protectedMethod=['POST','GET','DELETE'];

const protectedPaths=['/auth','/book/'];

const dynamicCors=(req,callback)=>{
    const origin=req.header('origin');
    const method=req.method.toUpperCase();
    const path=req.path;
    const pathIsSensitive=protectedPaths.some(p=>path.startsWith(p));
    const methodIsSensitive=protectedMethod.some(method);
    if(pathIsSensitive || methodIsSensitive){
        if(isTrusted(origin)){
            return callback(null,{
                origin:origin,
                credentials:true,
                methods:['GET','POST','DELETE','HEAD','PATCH','PUT'],
                allowedHeaders:['Content-Type','Authorization'],
            })
        }
        else{
            return callback(null,{origin:false});
        }
    }
    return callback(null,{origin:'*'});
}
app.use(cors(dynamicCors));
app.use(express.json())
app.use(CookieParser());
const csrfProtection=csrf({
    cookie:{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
    },
})
app.use(csrfProtection);
app.use('/bookImage',bookImageRouter);
app.use('/authors',authorRouter);
app.use('/books',bookRouter);
app.get('/ping',(req,res)=>{
    res.json({message:"pong"}).status(200);
});

app.listen(port,()=>{
    console.log(`Server up and running on port: ${port}`)
})