function compraFinalizada(req, res) {
  const pedidoId = req.body?.pedidoId;

  if (pedidoId === undefined || pedidoId === null || String(pedidoId).trim() === '') {
    return res.status(400).json({ erro: 'pedidoId é obrigatório' });
  }

  return res.status(202).json({
    status: 'aceito',
    mensagem: `Compra #${pedidoId} em processamento`,
  });
}

module.exports = {
  compraFinalizada,
};