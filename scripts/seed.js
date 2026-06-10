const { seedProdutos } = require('../src/data/seed');
const { produtos } = require('../src/data/store');

seedProdutos();

console.log(`Seed aplicado com ${produtos.length} produtos.`);