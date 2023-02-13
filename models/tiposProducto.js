const mongoose = require('mongoose');

const TiposProductoSchema = new mongoose.Schema({
  nombre_type: {type: String, required: true, maxLength: 45, default: ""},
  descripcion_type: {type: String, maxLength: 200, default: ""}
});

module.exports = mongoose.model('TiposProducto', TiposProductoSchema);