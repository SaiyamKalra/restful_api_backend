import {Router} from 'express';
import { postImage,multipleUploadFiles, getImage, deleteImage } from '../controllers/book_image.controller';
import cors from 'cors';
const bookImage=Router();

bookImage.post('/',multipleUploadFiles,postImage);
bookImage.get('/',multipleUploadFiles,getImage);
bookImage.delete('/delete/:id',cors(),deleteImage);
bookImage.options('/delete/:id',cors());
export default bookImage;