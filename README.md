# E-commerce - Integração

Projeto de API Node.js em MVC para demo de integração entre produtos, pedidos, país e evento de compra finalizada.

## Parte 1 - Visão geral

Fluxo principal da API:

- Cadastro e atualização de produtos.
- Criação de pedidos com validação de país via REST Countries.
- Aplicação de desconto progressivo por quantidade.
- Resposta de estoque insuficiente com mensagem clara.
- Validação de itens inválidos antes de processar o pedido.
- Tratamento de indisponibilidade da API de países com resposta `503`.
- Evento `POST /eventos/compra-finalizada` com resposta `202`.

## Parte 2 - Como rodar

```bash
npm install
npm start
```

## Parte 3 - Como testar

```bash
npm test
```

## Parte 4 - Endpoints

- `GET /produtos`
- `POST /produtos`
- `PUT /produtos/:id`
- `POST /pedidos`
- `GET /pedidos`
- `GET /pais/:codigo`
- `POST /eventos/compra-finalizada`

## Parte 5 - Exemplos rápidos

### Listar produtos

```bash
curl http://localhost:3000/produtos
```

### Criar produto

```bash
curl -X POST http://localhost:3000/produtos \
	-H "Content-Type: application/json" \
	-d '{
		"nome": "Produto A",
		"preco": 100,
		"estoque": 10,
		"categoria": "geral"
	}'
```

### Criar pedido

```bash
curl -X POST http://localhost:3000/pedidos \
	-H "Content-Type: application/json" \
	-d '{
		"cliente": "Carlos",
		"paisCodigo": "BR",
		"itens": [{ "produtoId": 1, "quantidade": 5 }]
	}'
```

### Consultar país

```bash
curl http://localhost:3000/pais/BR
```

### Evento de compra finalizada

```bash
curl -X POST http://localhost:3000/eventos/compra-finalizada \
	-H "Content-Type: application/json" \
	-d '{ "pedidoId": 1, "cliente": "Carlos", "pais": "BR", "total": 440.00, "moeda": "BRL" }'
```

## Parte 6 - Regras principais

- 1-2 itens: sem desconto
- 3-4 itens: 5%
- 5+ itens: 12%
- País inválido: `400` antes de criar o pedido
- Falha de rede/timeout na API de países: `503` sem criar o pedido
- Estoque insuficiente: `400` com item e quantidade disponível
- `POST /eventos/compra-finalizada` exige `pedidoId`

## Parte 7 - Resposta esperada no pedido

- `subtotal`
- `desconto`
- `total`
- `pais`
- `moeda`

## Parte 8 - Observação

- A aplicação usa armazenamento em memória, então os dados são perdidos ao reiniciar o servidor.
- Ao iniciar com `npm start`, a API sobe com produtos iniciais para a demo.
