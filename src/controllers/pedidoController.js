const pedidoService = require('../services/pedidoService');

async function criar(req, res, next) {
  try {
    const pedido = await pedidoService.criarPedido(req.body);
    return res.status(201).json(pedido);
  } catch (erro) {
    return next(erro);
  }
}

function listar(req, res) {
  return res.json(pedidoService.listarPedidos());
}

module.exports = {
  criar,
  listar,
};