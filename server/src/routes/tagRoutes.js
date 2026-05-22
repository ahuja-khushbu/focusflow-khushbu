import { Router } from 'express';
import Joi from 'joi';
import { listTags, createTag, deleteTag } from '../controllers/tagsController.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

const createTagSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  color: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .default('#D97757'),
});

router.use(auth);
router.get('/', listTags);
router.post('/', validate(createTagSchema), createTag);
router.delete('/:id', deleteTag);

export default router;
