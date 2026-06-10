async function buscarPaisPorCodigo(codigo) {
  const codigoNormalizado = String(codigo || '').trim().toUpperCase();

  if (!codigoNormalizado) {
    const erro = new Error('Código do país é obrigatório');
    erro.statusCode = 400;
    throw erro;
  }

  const response = await fetch(`https://restcountries.com/v3.1/alpha/${codigoNormalizado}`);

  if (!response.ok) {
    const erro = new Error('País inválido');
    erro.statusCode = 400;
    throw erro;
  }

  const dados = await response.json();
  const pais = Array.isArray(dados) ? dados[0] : dados;
  const moedaEntrada = pais && pais.currencies ? Object.entries(pais.currencies)[0] : null;

  return {
    codigo: codigoNormalizado,
    nameCommon: pais?.name?.common || pais?.translations?.por?.common || codigoNormalizado,
    currencies: pais?.currencies || null,
    moeda: moedaEntrada ? moedaEntrada[0] : null,
  };
}

module.exports = {
  buscarPaisPorCodigo,
};