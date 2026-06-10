# E-commerce - Integração

Projeto de exemplo para integração de sistemas (API Node.js sem banco).

Instalação e execução

1. Instale dependências:

```bash
npm install
```

2. Rodar testes:

```bash
npm test
```

3. Iniciar servidor:

```bash
npm start
# ou em dev
npm run dev
```

Endpoints principais (base: `http://localhost:3000`)

- `GET /produtos` - lista produtos
- `POST /produtos` - criar produto
  Exemplo body:
  ```json
  { "nome": "Produto A", "preco": 100, "estoque": 10, "categoria": "geral" }
  ```
- `PUT /produtos/:id` - atualizar produto
- `POST /pedidos` - criar pedido (valida país antes de tentar reservar estoque)
  Exemplo body:
  ```json
  {
    "cliente": "Carlos",
    "paisCodigo": "BR",
    "itens": [{ "produtoId": 1, "quantidade": 5 }]
  }
  ```
- `GET /pedidos` - listar pedidos
- `GET /pais/:codigo` - buscar nome e moeda do país (consome REST Countries)
- `POST /eventos/compra-finalizada` - receber evento de compra finalizada
  Exemplo body:
  ```json
  { "pedidoId": 1, "cliente": "Carlos", "pais": "BR", "total": 440.00, "moeda": "BRL" }
  ```

Formato de respostas importantes

- `POST /pedidos` retorna `201` com JSON contendo `subtotal`, `desconto` (ex.: "12%"), `total`, `pais` e `moeda`.
- `POST /eventos/compra-finalizada` retorna `202 Accepted` com `{ "status": "aceito", "mensagem": "Compra #<id> em processamento" }`.

Testes

- Os testes obrigatórios estão em `__tests__/pedido.test.js` e cobrem:
  - cálculo do desconto progressivo
  - rejeição por estoque insuficiente
  - criação de pedido com desconto e moeda

Thunder Client

Importe `thunder-collection.json` na sua extensão Thunder Client para a coleção de exemplos usada na apresentação.

Observações

- Este projeto usa uma store em memória (`src/data/store.js`). Reinicie o servidor para limpar o estado.
