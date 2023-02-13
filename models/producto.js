const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    nombre_producto: {type: String, maxLength: 50, required: true, default: ""},
    descripcion_producto: {type: String, maxLength: 200, default: ""},
    cantidad_producto: {type: Number, default: 0},
    unidad_medida_producto: {type: String, maxLength: 25, default: ""},
    precio_compra_producto: {type: Number, default: 0},
    precio_venta_producto: {type: Number, default: 0},
    precio_venta_maximo_producto: {type: Number, default: 0},
    precio_venta_minimo_producto: {type: Number, default: 0},
    moneda_producto: {type: String, maxLength: 45, default: ""},
    referencia_producto: {type: String, maxLength: 45, default: ""},
    notas_producto: {type: String, maxLength: 200, default: ""},
    codigo_producto: {type: Number, maxLength: 25, required: true, unique: true},
    fecha_inicial_producto: {type: Date, default: Date.now},
    fecha_ult_actualizacion_producto: {type: Date, default: Date.now},
    parametro_1_producto: {type: String, maxLength: 200, default: ""},
    parametro_2_producto: {type: String, maxLength: 200, default: ""},
    estado_producto: {type: Boolean},
    categoriaProducto_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'CategoriasProducto'},
    tiposProducto_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'TiposProducto'},
    empresa_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Empresa'}
  });


module.exports = mongoose.model('Producto', ProductoSchema);