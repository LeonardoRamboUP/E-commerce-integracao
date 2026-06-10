const FETCH_TIMEOUT_MS = 5000;

async function buscarPaisPorCodigo(codigo, opcoes = {}) {
  const codigoNormalizado = String(codigo || '').trim().toUpperCase();

  if (!codigoNormalizado) {
    const erro = new Error('Código do país é obrigatório');
    erro.statusCode = 400;
    throw erro;
  }

  const timeoutMs = Number.isFinite(opcoes.timeoutMs) ? opcoes.timeoutMs : FETCH_TIMEOUT_MS;
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timeoutId = controller && timeoutMs > 0
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;

  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${codigoNormalizado}`,
      controller ? { signal: controller.signal } : undefined
    );

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
  } catch (erro) {
    if (erro?.name === 'AbortError') {
      const timeoutError = new Error('Serviço de país indisponível no momento');
      timeoutError.statusCode = 503;
      throw timeoutError;
    }

    if (erro?.statusCode) {
      throw erro;
    }

    const serviceError = new Error('Serviço de país indisponível no momento');
    serviceError.statusCode = 503;
    throw serviceError;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

module.exports = {
  buscarPaisPorCodigo,
};