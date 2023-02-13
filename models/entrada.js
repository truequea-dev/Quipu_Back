const mongoose = require('mongoose');

const EntradaSchema = new mongoose.Schema({
  valor_ent: {type: Number, default: 0},
  fecha_ent: {type: Date, default: Date.now},
  servicios_idServicio: [{type: mongoose.Schema.Types.ObjectId, ref: 'Servicio'}]
});

module.exports = mongoose.model('Entrada', EntradaSchema);