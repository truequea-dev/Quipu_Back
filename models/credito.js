const mongoose = require('mongoose');

const CreditoSchema = new mongoose.Schema({
  total_cr: {type: Number, default: 0},
  saldo_cr: {type: Number, default: 0},
  pago_cr: {type: Number, default: 0},
  fecha_ultimo_pago_cr: {type: Date, default: Date.now},
  nro_cuotas_totales: {type: Number, default: 0},
  nro_cuotas_pagas: {type: Number, default: 0},
  servicios_idServicio: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Servicio'},
  empresa_id: {type: mongoose.Schema.Types.ObjectId, required: true,  ref: 'Empresa'},
});

module.exports = mongoose.model('Credito', CreditoSchema);