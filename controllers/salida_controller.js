var Salidamodels = require('../models/salida');
var Empresamodels = require('../models/empresa');

var currentDate = new Date();
var date = currentDate.getDate();
var month = currentDate.getMonth(); //Be careful! January is 0 not 1
var strMonts = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var monthName = strMonts[month]
var year = currentDate.getFullYear();

let fecha = date + monthName + year;

class SalidaController {

  //obtener todos los Salidas
  getAllSalidas(req, res){

    Salidamodels.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando Salidas");
        return;
      }
      if (doc !== null) {
        //console.log("listado de Salidas");
        //console.log(doc);
        let salidasAux = doc;
        let Salidas = [];
        for (var i = salidasAux.length - 1; i >= 0; i--) {
          Salidas.push(salidasAux[i]);
        }
        return res.status(200).send({
          success: true,
          message: 'Salidas recibidos satisfactoriamente',
          Salidas,
        });
      }
      else {
        console.log("Salidas no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno Salidas'
        });
      }
    });

  }

  async getSalidaByIdEmp(req, res) {
    if (!req.params.idemp) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
      }

    const idEmp = req.params.idemp;
    try {
      const salidas = await Salidamodels.find({empresa_id: idEmp})
      return res.status(200).send({
        success: true,
        message: 'Salidas encontradas exitosamente',
        salidas
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //Guardar Salida
  async addSalida(req, res){

    const { valor_sal, descrp_salida, fecha_sal, empresa_id } = req.body;

    const dataEmp = await Empresamodels.findOne({ _id: empresa_id })
    if (dataEmp === null) {
      return res.status(403).send({
        success: false,
        message: 'id no encontrado en empresas'
      });
    }

    let Salida_nuevo = new Salidamodels({
      valor_sal,
      fecha_sal: fecha_sal || currentDate,
      descrp_salida: descrp_salida || "",
      empresa_id
    })

    try {
      const saveSalida = await Salida_nuevo.save();
      dataEmp.arraySalEmp = dataEmp.arraySalEmp.concat(saveSalida._id)
      await dataEmp.save();
      return res.status(201).send({
        success: true,
        message: "Salida agregado",
        saveSalida
      });
    } catch (error) {
      return res.status(403).send({
        success: false,
        message: error.message
      })
    }
  }

  //obtener Salida por Id
  getOneSalida(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    //console.log(id)

    Salidamodels.findOne({ _id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando Salida por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando Salida por id'
        });
      }
      if (doc !== null) {
        let Salida = doc;
        return res.status(200).send({
          success: true,
          message: 'Salida encontrado exitosamente',
          Salida,
        });
      }
      else {
        //console.log("Salida no encontrado")
        return res.status(404).send({
          success: false,
          message: 'Salida no encontrado',
        });
      }
    });
  }

  //eliminar Salida por Id
  async deleteOneSalida(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
    }

    let id = req.params.id;

    const idDeleteSal = await Salidamodels.findById({_id : id})
    if (idDeleteSal === null) {
        return res.status(404).send({
          success: false,
          message: 'Salida no encontrada',
        });
    }
    const dataEmp = await Empresamodels.findById({_id : idDeleteSal.empresa_id})
    const arraySal = dataEmp.arraySalEmp;
    const indexSalDelet = arraySal.indexOf(id);
    arraySal.splice(indexSalDelet, 1)
    try {
      await dataEmp.save();
      const deleteSal = await Salidamodels.deleteOne({ _id: id})
      if (deleteSal.deletedCount === 0) {
        return res.status(404).send({
          success: false,
          message: 'Producto no eliminado',
        });
      }else {
        return res.status(200).send({
          success: true,
          message: 'Producto eliminado exitosamente',
        });
      }
    } catch (error) {
      return res.status(404).send({
        success: false,
        message: error.message
      });
    }
  }

  //actualizar Salida por Id
  updateSalida(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

     let id = req.params.id;
     Salidamodels.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando Salida por id");
         return res.status(403).send({
           success: false,
           message: 'id no encontrado en Salidas'
         });
       }
       if (doc !== null) {
         let SalidaViejo = doc;

         if (req.body.valor_sal != SalidaViejo.valor_sal) {
           SalidaViejo.valor_sal = req.body.valor_sal
         }
         if (req.body.descrp_salida != SalidaViejo.descrp_salida) {
           SalidaViejo.descrp_salida = req.body.descrp_salida
          }

         Salidamodels.updateOne(
           { _id: id},
           { $set: SalidaViejo},
           (err, doc) => {
             if (err) {
               return res.status(404).send({
                 success: false,
                 message: 'Salida no encontrado',
               });
             }
             return res.status(201).send({
               success: true,
               message: 'Salida actualizado satisfactoriamente',
               SalidaViejo
             });
           }
         )}
       else {
         //console.log("Salida no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Salida detalle no encontrado',
         });
       }
     })
   }

}

const salidaController = new SalidaController();
module.exports = salidaController;
