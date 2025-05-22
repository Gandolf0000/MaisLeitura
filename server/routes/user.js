
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { nome, email, senha, tipo } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Usuário já existe' });

    const hashedSenha = await bcrypt.hash(senha, 10);

    const newUser = new User({ nome, email, senha: hashedSenha, tipo });
    await newUser.save();

    res.status(201).json({ message: 'Usuário criado com sucesso' });
});

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const isSenhaValida = await bcrypt.compare(senha, user.senha);
    if (!isSenhaValida) return res.status(401).json({ message: 'Senha inválida' });

    const token = jwt.sign(
        { id: user._id, tipo: user.tipo },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
    );

    res.json({
        token,
        user: {
            id: user._id,
            nome: user.nome,
            email: user.email,
            tipo: user.tipo
        }
    });
});

module.exports = router;
