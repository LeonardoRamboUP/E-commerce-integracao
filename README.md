# E-commerce - Integração

Projeto de API Node.js em MVC para demo de integração entre produtos, pedidos, país e evento de compra finalizada.

## O que vamos mostrar

- Cadastro e atualização de produtos.
- Criação de pedidos com validação de país via REST Countries.
- Aplicação de desconto progressivo por quantidade.
- Resposta de estoque insuficiente com mensagem clara.
- Evento `POST /eventos/compra-finalizada` com resposta `202`.

## Como rodar

```bash
npm install
npm start
```

## Como testar

```bash
npm test
```

## Endpoints

- `GET /produtos`
- `POST /produtos`
- `PUT /produtos/:id`
- `POST /pedidos`
- `GET /pedidos`
- `GET /pais/:codigo`
- `POST /eventos/compra-finalizada`

## Exemplos rápidos (curl)

- Listar produtos

```bash
curl http://localhost:3000/produtos
```

- Criar produto

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

- Criar pedido (ex.: desconto 12% com 5 itens)

```bash
curl -X POST http://localhost:3000/pedidos \
	-H "Content-Type: application/json" \
	-d '{
		"cliente": "Carlos",
		"paisCodigo": "BR",
		"itens": [{ "produtoId": 1, "quantidade": 5 }]
	}'
```

- Consultar país

```bash
curl http://localhost:3000/pais/BR
```

- Evento — compra finalizada

```bash
curl -X POST http://localhost:3000/eventos/compra-finalizada \
	-H "Content-Type: application/json" \
	-d '{ "pedidoId": 1, "cliente": "Carlos", "pais": "BR", "total": 440.00, "moeda": "BRL" }'
```

## Regras principais

- 1-2 itens: sem desconto
- 3-4 itens: 5%
- 5+ itens: 12%
- País inválido: `400` antes de criar o pedido
- Estoque insuficiente: `400` com item e quantidade disponível

## Resposta esperada no pedido

- `subtotal`
- `desconto`
- `total`
- `pais`
- `moeda`

## Observação

- A aplicação usa armazenamento em memória, então os dados são perdidos ao reiniciar o servidor.
