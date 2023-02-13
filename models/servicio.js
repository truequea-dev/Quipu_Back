const mongoose = require('mongoose');

const ServicioSchema = new mongoose.Schema({
  fecha_svcio: {type: Date, default: Date.now},
  // nro_factura_svcio: {type: Number, default: 10, unique: true},
  nro_factura_svcio: {type: Number, default: 0},
  descripcion_svcio: {type: String, default: "fechaLetras"},
  es_credito_svcio: {type: Boolean, default: false},
  otros_svcio: {type: String, maxLength: 100, default: ""},
  productos_array: {type: Array, default: [], ref: 'Producto'},
  // productos_array: [{type: mongoose.Schema.Types.ObjectId, default: [], ref: 'Producto'}],
  total_precio_servicio: {type: Number, default: 0},
  total_precio_condescuento: {type: Number, default: 0},
  valor_cancelado_svcio: {type: Number, default: 0},
  notas_garantia_svcio: {type: String, maxLength: 200, default: ""},
  es_estado_svcio: {type: Boolean, default: false},
  cliente_idCliente: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Cliente'},
  empresa_id: {type: mongoose.Schema.Types.ObjectId, required: true,  ref: 'Empresa'},
});

module.exports = mongoose.model('Servicio', ServicioSchema);