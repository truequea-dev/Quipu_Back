const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombres_cliente: {type: String, maxLength: 150, default: "no registro"},
  apellidos_cliente: {type: String, maxLength: 150, default: "no registro"},
  dni_cliente: {type: Number, maxLength: 45, unique: true, required: true},
  cel_cliente: {type: String, maxLength: 45, default: "no registro"},
  direccion_cliente: {type: String, maxLength: 45, default: "no registro"},
  correo_cliente: {type: String, maxLength: 45, default: "no registro"},
  parametros_1_cliente: {type: String, maxLength: 150, default: "no registro"},
  parametros_2_cliente: {type: String, maxLength: 150, default: "no registro"},
  empresa_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Empresa'}
});

module.exports = mongoose.model('Cliente', ClienteSchema);