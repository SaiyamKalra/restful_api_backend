import {Router} from 'express';
// FIX: Go up one directory (from src/routes to src/), then into the controllers folder.
import { getAllAuthors ,updateAuthor,deleteAuthor,getAuthorById,createAuthor} from '../controllers/author.controller';
const authorRouter=Router();

authorRouter.get('/',getAllAuthors);
authorRouter.get('/:id',getAuthorById);
authorRouter.post('/',createAuthor);
authorRouter.put('/:id',updateAuthor);
authorRouter.delete('/:id',deleteAuthor);

export default authorRouter;