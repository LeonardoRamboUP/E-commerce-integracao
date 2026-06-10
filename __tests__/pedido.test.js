const request = require('supertest');

const app = require('../app');
const { resetStore } = require('../src/data/store');
const { calcularPercentualDesconto, criarPedido } = require('../src/services/pedidoService');

describe('Fluxo de pedidos', () => {
  beforeEach(() => {
    resetStore();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  function mockPaisValido() {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          name: { common: 'Brazil' },
          currencies: {
            BRL: { name: 'Brazilian real', symbol: 'R$' },
          },
        },
      ],
    });
  }

  test('calcula desconto progressivo', () => {
    expect(calcularPercentualDesconto(1)).toBe(0);
    expect(calcularPercentualDesconto(2)).toBe(0);
    expect(calcularPercentualDesconto(3)).toBe(0.05);
    expect(calcularPercentualDesconto(4)).toBe(0.05);
    expect(calcularPercentualDesconto(5)).toBe(0.12);
  });

  test('rejeita pedido com estoque insuficiente', async () => {
    mockPaisValido();

    await request(app)
      .post('/produtos')
      .send({ nome: 'Produto C', preco: 80, estoque: 2, categoria: 'geral' })
      .expect(201);

    await expect(
      criarPedido({
        paisCodigo: 'BR',
        itens: [{ produtoId: 1, quantidade: 3 }],
      })
    ).rejects.toThrow('Produto C - disponível: 2');
  });

  test('rejeita pedido com itens inválidos', async () => {
    mockPaisValido();

    await request(app)
      .post('/produtos')
      .send({ nome: 'Produto D', preco: 70, estoque: 5, categoria: 'geral' })
      .expect(201);

    await expect(
      criarPedido({
        cliente: 'Carlos',
        paisCodigo: 'BR',
        itens: [{ produtoId: 'abc', quantidade: 2 }],
      })
    ).rejects.toMatchObject({
      message: 'Item 1 deve informar produtoId válido',
      statusCode: 400,
    });
  });

  test('POST /pedidos retorna 503 quando a API de países falha', async () => {
    global.fetch.mockRejectedValue(new Error('network error'));

    await request(app)
      .post('/produtos')
      .send({ nome: 'Produto E', preco: 90, estoque: 5, categoria: 'geral' })
      .expect(201);

    const resposta = await request(app)
      .post('/pedidos')
      .send({
        cliente: 'Carlos',
        paisCodigo: 'BR',
        itens: [{ produtoId: 1, quantidade: 1 }],
      })
      .expect(503);

    expect(resposta.body.erro).toBe('Serviço de país indisponível no momento');
  });

  test('POST /eventos/compra-finalizada exige pedidoId', async () => {
    await request(app)
      .post('/eventos/compra-finalizada')
      .send({ cliente: 'Carlos' })
      .expect(400)
      .expect({ erro: 'pedidoId é obrigatório' });
  });

  test('POST /pedidos retorna 201 com desconto e moeda', async () => {
    mockPaisValido();

    await request(app)
      .post('/produtos')
      .send({ nome: 'Produto A', preco: 100, estoque: 10, categoria: 'geral' })
      .expect(201);

    const resposta = await request(app)
      .post('/pedidos')
      .send({
        cliente: 'Carlos',
        paisCodigo: 'BR',
        itens: [{ produtoId: 1, quantidade: 5 }],
      })
      .expect(201);

    expect(resposta.body.subtotal).toBe(500);
    expect(resposta.body.desconto).toBe('12%');
    expect(resposta.body.total).toBe(440);
    expect(resposta.body.pais).toBe('Brazil');
    expect(resposta.body.moeda).toBe('BRL');
  });
});