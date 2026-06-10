const { produtos, nextProdutoId } = require('../data/store');

function listarProdutos() {
  return produtos;
}

function obterProdutoPorId(id) {
  return produtos.find((produto) => produto.id === id);
}

function criarProduto(dados) {
  const produto = {
    id: nextProdutoId(),
    nome: dados.nome,
    preco: Number(dados.preco),
    estoque: Number(dados.estoque),
    categoria: dados.categoria,
  };

  produtos.push(produto);
  return produto;
}

function atualizarProduto(id, dados) {
  const produto = obterProdutoPorId(id);

  if (!produto) {
    return null;
  }

  if (dados.nome !== undefined) {
    produto.nome = dados.nome;
  }

  if (dados.preco !== undefined) {
    produto.preco = Number(dados.preco);
  }

  if (dados.estoque !== undefined) {
    produto.estoque = Number(dados.estoque);
  }

  if (dados.categoria !== undefined) {
    produto.categoria = dados.categoria;
  }

  return produto;
}

function reservarEstoque(id, quantidade) {
  const produto = obterProdutoPorId(id);

  if (!produto) {
    return null;
  }

  if (produto.estoque < quantidade) {
    const erro = new Error('Estoque insuficiente');
    erro.statusCode = 400;
    erro.dados = {
      nome: produto.nome,
      disponivel: produto.estoque,
    };
    throw erro;
  }

  produto.estoque -= quantidade;
  return produto;
}

module.exports = {
  listarProdutos,
  obterProdutoPorId,
  criarProduto,
  atualizarProduto,
  reservarEstoque,
};