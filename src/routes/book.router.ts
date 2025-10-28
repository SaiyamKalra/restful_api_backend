import {Router} from 'express';
// FIX: Go up one directory (from src/routes to src/), then into the controllers folder.
import { getAllBooks ,updateBook,deleteBook,getBooksById,createBook} from '../controllers/book.controller';
const bookRouter=Router();

bookRouter.get('/',getAllBooks);
bookRouter.get('/:id',getBooksById);
bookRouter.post('/',createBook);
bookRouter.put('/:id',updateBook);
bookRouter.delete('/:id',deleteBook);

export default bookRouter;