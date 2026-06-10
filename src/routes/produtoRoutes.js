const express = require('express');
const produtoController = require('../controllers/produtoController');

const router = express.Router();

router.get('/', produtoController.listar);
router.post('/', produtoController.criar);
router.put('/:id', produtoController.atualizar);

module.exports = router;