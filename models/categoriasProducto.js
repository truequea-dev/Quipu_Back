const mongoose = require('mongoose');

const CategoriasProductoSchema = new mongoose.Schema({
  nombre_categoria: {type: String, maxLength: 45, required: true, default: ""},
  descripcion_categoria: {type: String, maxLength: 200, default: ""}
});

module.exports = mongoose.model('CategoriasProducto', CategoriasProductoSchema);