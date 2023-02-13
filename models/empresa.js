const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
  nombre_empresa: {type: String, maxLength: 60, default: "", required: true},
  identificacion_empresa: {type: Number, unique: true, maxLength: 45, default: "", required: true},
  descripcion_empresa: {type: String, maxLength: 200, default: ""},
  fecha_registro_empresa: {type: Date, default: Date.now},
  pais_empresa: {type: String, maxLength: 45, default: ""},
  ciudad_empresa: {type: String, maxLength: 45, default: ""},
  direccion_empresa: {type: String, maxLength: 45, default: ""},
  telefono_empresa: {type: String, maxLength: 45, default: ""},
  email_empresa: {type: String, maxLength: 45, default: ""},
  nro_whatsapp: {type: String, maxLength: 45, default: ""},
  slogan_empresa: {type: String, maxLength: 100, default: ""},
  version_paquete_empresa: {type: String, maxLength: 45, default: ""},
  fecha_ultimo_mes_pago_empresa: {type: Date, default: Date.now},
  notas_empresa: {type: String, maxLength: 450, default: ""},
  estado_empresa: {type: Boolean, default: true},
  categoriasEmpresa_id: {type: mongoose.Schema.Types.ObjectId, ref: 'CategoriasEmpresa'},
  tiposEmpresa_id: {type: mongoose.Schema.Types.ObjectId, ref: 'TiposEmpresa'},
  imagePath: {type: String, default: ""}
});

module.exports = mongoose.model('Empresa', EmpresaSchema);