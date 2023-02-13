var Entradamodels = require('../models/entrada');

var currentDate = new Date();
var date = currentDate.getDate();
var month = currentDate.getMonth(); //Be careful! January is 0 not 1
var strMonts = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var monthName = strMonts[month]
var year = currentDate.getFullYear();

let fecha = date + monthName + year;

class EntradaController {

  //obtener todos los Entradas
  getAllEntradas(req, res){

    Entradamodels.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando Entradas");
        return;
      }
      if (doc !== null) {
        let Entradas = doc;
        //console.log("listado de Entradas");
        //console.log(doc);
        return res.status(200).send({
          success: true,
          message: 'Entradas recibidos satisfactoriamente',
          Entradas,
        });
      }
      else {
        console.log("Entradas no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno Entradas'
        });
      }
    });

  }


  //Guardar Entrada
  addEntrada(req, res){

    //console.log("req.body")
    //console.log(req.body)

    const { valor_ent, fecha_ent, servicios_idServicio } = req.body;

    let Entrada_nuevo = new Entradamodels({
      valor_ent,
      fecha_ent: fecha_ent || currentDate,
      servicios_idServicio
    })

    Entrada_nuevo.save((err) => {
      if (err) {
        //console.log(`error guardar Entrada: ${err}`);
        return res.status(403).send({
          success: false,
          message: err.message
        })
      }
      else {
        //console.log(`guardar Entrada: OK`);
        return res.status(201).send({
          success: true,
          message: "Entrada agregado",
          Entrada_nuevo
        });
      }
    });

  }

  //obtener Entrada por Id
  getOneEntrada(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    //console.log(id)

    Entradamodels.findOne({ _id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando Entrada por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando Entrada por id'
        });
      }
      if (doc !== null) {
        let Entrada = doc;
        return res.status(200).send({
          success: true,
          message: 'Entrada encontrado exitosamente',
          Entrada,
        });
      }
      else {
        //console.log("Entrada no encontrado")
        return res.status(404).send({
          success: false,
          message: 'Entrada no encontrado',
        });
      }
    });
  }

  //eliminar Entrada por Id
  async deleteOneEntrada(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    const ifEnt = await Entradamodels.findOne({_id : id})
    if (!ifEnt) {
      return res.status(400).send({
        success: true,
        message: "Entrada no encontrada"
    })
    }
    Entradamodels.deleteOne({ _id: id}, (err, doc) => {
      if (err) {
        return res.status(404).send({
          success: false,
          message: 'Entrada no encontrado',
        });
      }
      //console.log("Entrada eliminado");
      return res.status(200).send({
        success: true,
        message: 'Entrada eliminado exitosamente',
      });
    })
  }

  //actualizar Entrada por Id
  updateEntrada(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

     let id = req.params.id;

     const { fecha_ent } = req.body;

     Entradamodels.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando Entrada por id");
         return res.status(403).send({
           success: false,
           message: 'id no encontrado en Entradas'
         });
       }
       if (doc !== null) {
         let EntradaViejo = doc;

         if (req.body.valor_ent != EntradaViejo.valor_ent) {
           EntradaViejo.valor_ent = req.body.valor_ent
         }
         if (req.body.servicios_idServicio != EntradaViejo.servicios_idServicio) {
           EntradaViejo.servicios_idServicio = req.body.servicios_idServicio
         }

         EntradaViejo.fecha_ent = fecha_ent || currentDate;

         Entradamodels.updateOne(
           { _id: id},
           { $set: EntradaViejo},
           (err, doc) => {
             if (err) {
               return res.status(404).send({
                 success: false,
                 message: 'Entrada no encontrado',
               });
             }
             return res.status(201).send({
               success: true,
               message: 'Entrada actualizado satisfactoriamente',
               EntradaViejo
             });
           }
         )}
       else {
         //console.log("Entrada no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Entrada detalle no encontrado',
         });
       }
     })
   }

}

const entradaController = new EntradaController();
module.exports = entradaController;
