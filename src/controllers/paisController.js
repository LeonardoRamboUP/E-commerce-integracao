const paisService = require('../services/paisService');

async function obter(req, res, next) {
  try {
    const pais = await paisService.buscarPaisPorCodigo(req.params.codigo);
    return res.json({
      pais: pais.pais,
      moeda: pais.moeda,
    });
  } catch (erro) {
    return next(erro);
  }
}

module.exports = {
  obter,
};