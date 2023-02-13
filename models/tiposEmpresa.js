const mongoose = require('mongoose');

const TiposEmpresaSchema = new mongoose.Schema({
  nombre_type: {type: String, required: true, maxLength: 45, default: ""},
  descripcion_type: {type: String, maxLength: 200, default: ""}
});

module.exports = mongoose.model('TiposEmpresa', TiposEmpresaSchema);