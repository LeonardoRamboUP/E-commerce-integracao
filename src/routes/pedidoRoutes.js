const express = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

router.post('/', pedidoController.criar);
router.get('/', pedidoController.listar);

module.exports = router;