const express = require('express');

const produtoRoutes = require('./src/routes/produtoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const paisRoutes = require('./src/routes/paisRoutes');
const eventoRoutes = require('./src/routes/eventoRoutes');
const { seedProdutos } = require('./src/data/seed');

const app = express();

app.use(express.json());

app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/pais', paisRoutes);
app.use('/eventos', eventoRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno';

  res.status(statusCode).json({ erro: message });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;

  seedProdutos();

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

module.exports = app;