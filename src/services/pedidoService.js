const { pedidos, nextPedidoId } = require('../data/store');
const { obterProdutoPorId, reservarEstoque } = require('./produtoService');
const { buscarPaisPorCodigo } = require('./paisService');

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
  const itens = Array.isArray(dados.itens) ? dados.itens : [];

  if (itens.length === 0) {
    const erro = new Error('Pedido deve conter itens');
    erro.statusCode = 400;
    throw erro;
  }

  const itensNormalizados = itens.map((item) => ({
    produtoId: Number(item.produtoId),
    quantidade: Number(item.quantidade),
  }));

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
    id: nextPedidoId(),
    cliente: dados.cliente || null,
    pais: pais.pais,
    moeda: pais.moeda,
    itens: itensPedido,
    subtotal,
    desconto: `${Math.round(percentualDesconto * 100)}%`,
    descontoValor: desconto,
    total,
    criadoEm: new Date().toISOString(),
  };

  pedidos.push(pedido);
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