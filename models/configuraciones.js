const mongoose = require('mongoose');

const ConfiguracionesSchema = new mongoose.Schema({
  es_label_factura_activo: {type: Boolean, default: true},
  es_label_Ccobro_activo: {type: Boolean, default: false},
  es_credito__activo: {type: Boolean, default: false},
  nro_factura_svcio_inicial: {type: Number, default: 1},
  nro_factura_svcio_actual: {type: Number, default: 1},
  empresa_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Empresa'}
});

module.exports = mongoose.model('Configuraciones', ConfiguracionesSchema);