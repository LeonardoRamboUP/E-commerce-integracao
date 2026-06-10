const produtoService = require('../services/produtoService');

function listar(req, res) {
  return res.json(produtoService.listarProdutos());
}

function criar(req, res) {
  const { nome, preco, estoque, categoria } = req.body;

  if (!nome || preco === undefined || estoque === undefined || !categoria) {
    return res.status(400).json({ erro: 'nome, preco, estoque e categoria são obrigatórios' });
  }

  const produto = produtoService.criarProduto({ nome, preco, estoque, categoria });
  return res.status(201).json(produto);
}

function atualizar(req, res) {
  const id = Number(req.params.id);
  const produto = produtoService.atualizarProduto(id, req.body);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  return res.json(produto);
}

module.exports = {
  listar,
  criar,
  atualizar,
};