const { pedidos, nextPedidoId } = require('../data/store');
const { obterProdutoPorId, reservarEstoque } = require('./produtoService');
const { buscarPaisPorCodigo } = require('./paisService');

function criarErro(mensagem, statusCode) {
  const erro = new Error(mensagem);
  erro.statusCode = statusCode;
  return erro;
}

function normalizarItens(itens) {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw criarErro('Pedido deve conter itens', 400);
  }

  return itens.map((item, indice) => {
    const produtoId = Number(item?.produtoId);
    const quantidade = Number(item?.quantidade);

    if (!Number.isInteger(produtoId) || produtoId <= 0) {
      throw criarErro(`Item ${indice + 1} deve informar produtoId válido`, 400);
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      throw criarErro(`Item ${indice + 1} deve informar quantidade válida`, 400);
    }

    return { produtoId, quantidade };
  });
}

function calcularPercentualDesconto(totalItens) {
  if (totalItens >= 5) {
    return 0.12;
  }

  if (totalItens >= 3) {
    return 0.05;
  }

  return 0;
}

async function criarPedido(dados) {
  const pais = await buscarPaisPorCodigo(dados.paisCodigo);
  const itensNormalizados = normalizarItens(dados.itens);

  const itensPedido = [];
  let subtotal = 0;
  let totalItens = 0;

  for (const item of itensNormalizados) {
    const produto = obterProdutoPorId(item.produtoId);

    if (!produto) {
      const erro = new Error('Produto não encontrado');
      erro.statusCode = 400;
      throw erro;
    }

    try {
      reservarEstoque(item.produtoId, item.quantidade);
    } catch (erro) {
      if (erro.statusCode === 400 && erro.dados) {
        const mensagem = `${erro.dados.nome} - disponível: ${erro.dados.disponivel}`;
        const erroComDetalhe = new Error(mensagem);
        erroComDetalhe.statusCode = 400;
        throw erroComDetalhe;
      }

      throw erro;
    }

    const valorItem = produto.preco * item.quantidade;
    subtotal += valorItem;
    totalItens += item.quantidade;

    itensPedido.push({
      produtoId: produto.id,
      nome: produto.nome,
      quantidade: item.quantidade,
      precoUnitario: produto.preco,
      total: valorItem,
    });
  }

  const percentualDesconto = calcularPercentualDesconto(totalItens);
  const desconto = subtotal * percentualDesconto;
  const total = subtotal - desconto;

  const pedido = {
    subtotal,
    desconto: `${Math.round(percentualDesconto * 100)}%`,
    total,
    pais: pais.nameCommon || pais.pais,
    moeda: pais.moeda,
  };

  // persist minimal info for listing/internal use
  pedidos.push({ id: nextPedidoId(), cliente: dados.cliente || null, itens: itensPedido, ...pedido, criadoEm: new Date().toISOString() });
  return pedido;
}

function listarPedidos() {
  return pedidos;
}

module.exports = {
  criarPedido,
  listarPedidos,
  calcularPercentualDesconto,
};