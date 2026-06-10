function compraFinalizada(req, res) {
  const pedidoId = req.body?.pedidoId;

  return res.status(202).json({
    status: 'aceito',
    mensagem: `Compra #${pedidoId} em processamento`,
  });
}

module.exports = {
  compraFinalizada,
};