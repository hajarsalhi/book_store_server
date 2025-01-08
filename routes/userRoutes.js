import express from 'express';
const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/purchased-books',getPurchasedBooks);

export default router;
