const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo à Monetiza!' });
});

module.exports = app;