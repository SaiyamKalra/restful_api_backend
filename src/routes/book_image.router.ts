import {Router} from 'express';
import { postImage,multipleUploadFiles, getImage, deleteImage } from '../controllers/book_image.controller';

const bookImage=Router();

bookImage.post('/',multipleUploadFiles,postImage);
bookImage.get('/',multipleUploadFiles,getImage);
bookImage.delete('/delete/:id',deleteImage);
export default bookImage;