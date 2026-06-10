const express = require('express');
const paisController = require('../controllers/paisController');

const router = express.Router();

router.get('/:codigo', paisController.obter);

module.exports = router;