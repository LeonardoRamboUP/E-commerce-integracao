const produtos = [];
const pedidos = [];

let produtoSequence = 1;
let pedidoSequence = 1;

function nextProdutoId() {
  return produtoSequence++;
}

function nextPedidoId() {
  return pedidoSequence++;
}

function resetStore() {
  produtos.splice(0, produtos.length);
  pedidos.splice(0, pedidos.length);
  produtoSequence = 1;
  pedidoSequence = 1;
}

module.exports = {
  produtos,
  pedidos,
  nextProdutoId,
  nextPedidoId,
  resetStore,
};