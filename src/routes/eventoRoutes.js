const express = require('express');
const eventoController = require('../controllers/eventoController');

const router = express.Router();

router.post('/compra-finalizada', eventoController.compraFinalizada);

module.exports = router;