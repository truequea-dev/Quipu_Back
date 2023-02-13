const mongoose = require('mongoose');

const CategoriasEmpresaSchema = new mongoose.Schema({
  nombre_categoria: {type: String, maxLength: 45, required: true, default: ""},
  descripcion_categoria: {type: String, maxLength: 200, default: ""}
});

module.exports = mongoose.model('CategoriasEmpresa', CategoriasEmpresaSchema);