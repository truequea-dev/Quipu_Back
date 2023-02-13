var Empresamodels = require('../models/empresa');
var Creditomodels = require('../models/credito');
var Entradamodels = require('../models/entrada');
var Serviciomodels = require('../models/servicio');

var currentDate = new Date();
var date = currentDate.getDate();
var month = currentDate.getMonth(); //Be careful! January is 0 not 1
var strMonts = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var monthName = strMonts[month]
var year = currentDate.getFullYear();

let fecha = date + monthName + year;

class CreditoController {

  //obtener todos los creditos
  async getAllcreditos(req, res){

    try {
      const dataCreditos = await Creditomodels.find({})
      return res.status(200).send({
        success: true,
        message: 'creditos recibidos satisfactoriamente',
        dataCreditos
      });
    } catch (error) {
      return res.status(404).send({
        success: false,
        message: error.message
      });
    }
  }

  //Agregar cr'edito
  addcredito(req, res){

    if (!req.body.servicios_idServicio) {
      return res.status(400).send({
        success: false,
        message: "servicios_idServicio requerido"
      });
    }

    if (!req.body.total_cr) {
      return res.status(400).send({
        success: false,
        message: "total_cr requerido"
      });
    }

    if (!req.body.pago_cr || req.body.pago_cr == 0) {
      req.body.pago_cr = 0;
    }

    //console.log("req.body")
    //console.log(req.body)
    let credito_nuevo = new Creditomodels({
      total_cr: req.body.total_cr,
      pago_cr: req.body.pago_cr,
      fecha_letras_cr: fecha,
      servicios_idServicio: req.body.servicios_idServicio || ""
    });

    let saldo = req.body.total_cr - req.body.pago_cr;
    credito_nuevo.saldo_cr = saldo;

    if (saldo <= 0) {
      return res.status(201).send({
        success: false,
        message: "credito ya est'a pago."
      });
    }

    credito_nuevo.save((err) => {
      if (err) {
        //console.log(`error guardar credito: ${err}`);
        return res.status(403).send({
          success: false,
          message: "credito no agregado. Reintente"
        });
      }
      else {
        //console.log(`guardar credito: OK`);
        return res.status(201).send({
          success: true,
          message: "credito agregado",
          credito_nuevo
        });
      }
    });
  }

  //obtener credito por Id
  getOnecredito(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    //console.log(id)

    Creditomodels.findOne({ _id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando credito por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando credito por id'
        });
      }
      if (doc !== null) {
        let credito = doc;
        return res.status(200).send({
          success: true,
          message: 'credito encontrado exitosamente',
          credito
        });
      }
      else {
        //console.log("credito no encontrado")
        return res.status(404).send({
          success: false,
          message: 'credito no encontrado',
        });
      }
    });
  }

  //eliminar credito por Id
  async deleteOnecredito(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    const ifCrt = await Creditomodels.findOne({_id : id})
    if (!ifCrt) {
      return res.status(400).send({
        success: true,
        message: "Credito no encontrado"
    })
    }
    const dataEmp = await Empresamodels.findById({_id : ifCrt.empresa_id})
    const arrayCredrit = dataEmp.arraycreditEmp;
    const indexCreditDelet = arrayCredrit.indexOf(id);
    arrayCredrit.splice(indexCreditDelet, 1)
    
    await dataEmp.save()
    
    Creditomodels.deleteOne({ _id: id}, (err, doc) => {
      if (err) {
        return res.status(404).send({
          success: false,
          message: 'credito no encontrado',
        });
      }
      //console.log("credito eliminado");
      return res.status(200).send({
        success: true,
        message: 'credito eliminado exitosamente',
      });
    })
  }

  //actualizar credito por Id
  updatecredito(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

     let id = req.params.id;
     Creditomodels.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando credito por id");
         return res.status(403).send({
           success: false,
           message: 'id no encontrado en creditos'
         });
       }
       if (doc !== null) {
         let creditoViejo = doc;
         let saldo = creditoViejo.saldo_cr;
         let pago = req.body.pago_cr;

         if (pago > saldo) {
           creditoViejo.saldo_cr = (pago - saldo) * (-1);
         } else {
           creditoViejo.saldo_cr = saldo - pago;
         }

         creditoViejo.pago_cr = pago;
         creditoViejo.fecha_letras_cr = fecha;

         Creditomodels.updateOne(
           { _id: id},
           { $set: creditoViejo},
           (err, doc) => {
             if (err) {
               return res.status(404).send({
                 success: false,
                 message: 'credito no encontrado',
               });
             }
             return res.status(201).send({
               success: true,
               message: 'credito actualizado satisfactoriamente',
               creditoViejo
             });
           }
         )
       }
       else {
         //console.log("credito no encontrado")
         return res.status(404).send({
           success: false,
           message: 'credito detalle no encontrado',
         });
       }
     })
  }

  //pagar ccuota
  async pagarCuota(req, res){

     if (!req.body.servicios_idServicio) {
      return res.status(400).send({
        success: false,
        message: 'servicios_idServicio es requerido',
        });
      }

      if (!req.body.pago_cr) {
       return res.status(400).send({
         success: false,
         message: 'pago_cr es requerido',
         });
       }

      let idServicio = req.body.servicios_idServicio;
      const dataCredit = await Creditomodels.find({ servicios_idServicio: idServicio })
      if (!dataCredit) {
        return res.status(403).send({
          success: false,
          message: 'idServicio no encontrado en creditos'
        });
      }
      const creditoReg = dataCredit[dataCredit.length - 1];
      const totalCr = creditoReg.total_cr;
      const pagoCr = req.body.pago_cr;
      
      if (creditoReg.saldo_cr === 0) {
        return res.status(400).send({
          success: false,
          message: 'El credito ya a sido pagado completamente'
        });
      }
      if (pagoCr > creditoReg.saldo_cr) {
        return res.status(400).send({
          success: false,
          message: 'El pago no debe superar el saldo'
        });
      }
      
      const dataEmp = await Empresamodels.findOne({ _id: creditoReg.empresa_id })
      const saldoCr = creditoReg.saldo_cr - pagoCr;

      const cuota_credito = new Creditomodels({
        total_cr: totalCr,
        saldo_cr: saldoCr,
        pago_cr: pagoCr,
        fecha_ultimo_pago_cr: currentDate,
        servicios_idServicio: idServicio,
        empresa_id: creditoReg.empresa_id
      });

      try {
        const saveCredit = await cuota_credito.save()
        dataEmp.arraycreditEmp = dataEmp.arraycreditEmp.concat(saveCredit._id)
        await dataEmp.save();
        const valorCanceladoSvcio = saveCredit.total_cr - saveCredit.saldo_cr;
        Serviciomodels.updateOne(
          { _id: saveCredit.servicios_idServicio},
          { $set: {"valor_cancelado_svcio": valorCanceladoSvcio}},
          (err, doc) => {
            if (err) {
              return res.status(404).send({
                success: false,
                message: 'servicio no encontrado',
              });
            }

            if (doc !== null) {
              let entradaNva = new Entradamodels({
                fecha_ent: currentDate,
                valor_ent: saveCredit.pago_cr,
                servicios_idServicio: saveCredit.servicios_idServicio
              });
              entradaNva.save((err) => {
                if (err) {
                  console.log(`error guardar entrada: ${err}`);
                  return res.status(403).send({
                    success: false,
                    message: "Entrada no agregada. Reintente"
                  })
                }
                console.log(`guardar credito: OK`);
                return res.status(201).send({
                  success: true,
                  message: "cuota paga",
                  saveCredit
                });
              })
            }
          });

      } catch (error) {
        return res.status(403).send({
          success: false,
          message: error.message
        });
      }
  }

  //obtener credito por servicio
  getOnecreditoByServicio(req, res){

      if (!req.params.idservicio) {
       return res.status(400).send({
         success: false,
         message: 'idservicio es requerido',
         });
       }

      let idservicio = req.params.idservicio;
      //console.log(idservicio)

      Creditomodels.find({ servicios_idServicio: idservicio}, (err, doc) => {
        if (err) {
          //console.log("error retornando vehiculo por placa");
          return res.status(403).send({
            success: false,
            message: 'error retornando creditos por id servicio'
          });
        }
        if (doc !== null) {
          let credito = doc;
          return res.status(201).send({
            success: true,
            message: 'credito por servicio',
            credito
          });
        } else {
          return res.status(403).send({
            success: false,
            message: 'credito no encontrado'
          });
        }
      })
  }
  //obtener creditos por empresa
  async getOnecreditoByEmpresa(req, res){

      if (!req.params.idempresa) {
       return res.status(400).send({
         success: false,
         message: 'idempresa es requerido',
         });
       }

      let idempresa = req.params.idempresa;

        const credito = await Creditomodels.find({empresa_id: idempresa}).populate('servicios_idServicio')

        return res.status(200).send({
          success: true,
          message: 'creditos recibidas satisfactoriamente',
          credito
        });


      // if (!req.params.idempresa) {
      //  return res.status(400).send({
      //    success: false,
      //    message: 'idempresa es requerido',
      //    });
      //  }

      // let idempresa = req.params.idempresa;

      // Creditomodels.find({ empresa_id: idempresa}, (err, doc) => {
      //   if (err) {
      //     return res.status(403).send({
      //       success: false,
      //       message: 'error retornando creditos por id empresa'
      //     });
      //   }
      //   if (doc !== null) {
      //     let credito = doc;
      //     return res.status(201).send({
      //       success: true,
      //       message: 'creditos por empresa',
      //       credito
      //     });
      //   } else {
      //     return res.status(403).send({
      //       success: false,
      //       message: 'creditos no encontrado'
      //     });
      //   }
      // })
  }

}

const creditoController = new CreditoController();
module.exports = creditoController;
