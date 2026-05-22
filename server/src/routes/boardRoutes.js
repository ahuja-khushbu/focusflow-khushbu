import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  listBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  addColumn,
  updateColumn,
  deleteColumn,
} from '../controllers/boardsController.js';

const router = Router();

router.use(auth);
router.get('/', listBoards);
router.post('/', createBoard);
router.patch('/:id', updateBoard);
router.delete('/:id', deleteBoard);

router.post('/:id/columns', addColumn);
router.patch('/:id/columns/:colId', updateColumn);
router.delete('/:id/columns/:colId', deleteColumn);

export default router;
