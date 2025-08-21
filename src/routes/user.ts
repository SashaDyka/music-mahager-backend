import express from 'express';
import prisma from '../db.js';
import bcrypt from 'bcrypt'; 

const router = express.Router();

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        displayName: true,
        createdAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});


router.post('/users', async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});



router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { displayName, email } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { displayName, email },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;