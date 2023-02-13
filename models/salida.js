const mongoose = require('mongoose');

const SalidaSchema = new mongoose.Schema({
  valor_sal: {type: Number, default: 0},
  fecha_sal: {type: Date, default: Date.now},
  descrp_salida: {type: String, maxLength:  75, default: ""},
  empresa_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Empresa'}
});

module.exports = mongoose.model('Salida', SalidaSchema);