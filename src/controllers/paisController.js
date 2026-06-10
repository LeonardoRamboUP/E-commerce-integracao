const paisService = require('../services/paisService');

async function obter(req, res, next) {
  try {
    const pais = await paisService.buscarPaisPorCodigo(req.params.codigo);
    return res.json({
      pais: pais.nameCommon,
      moeda: pais.moeda,
      currencies: pais.currencies,
    });
  } catch (erro) {
    return next(erro);
  }
}

module.exports = {
  obter,
};