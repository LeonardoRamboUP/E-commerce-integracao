const { produtos, nextProdutoId } = require('./store');

function seedProdutos() {
  if (produtos.length > 0) {
    return produtos;
  }

  const produtosIniciais = [
    { nome: 'Produto A', preco: 100, estoque: 10, categoria: 'geral' },
    { nome: 'Produto B', preco: 80, estoque: 8, categoria: 'geral' },
    { nome: 'Produto C', preco: 60, estoque: 6, categoria: 'geral' },
  ];

  for (const produto of produtosIniciais) {
    produtos.push({
      id: nextProdutoId(),
      ...produto,
    });
  }

  return produtos;
}

module.exports = {
  seedProdutos,
};