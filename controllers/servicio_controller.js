const {parseId} = require("../helpers/parserId");

var Serviciomodels = require('../models/servicio');
var Empresamodels = require('../models/empresa');
var Clientemodels = require('../models/cliente');
var Configuracionesmodels = require('../models/configuraciones');
var Productomodels = require('../models/producto');
var Entradamodels = require('../models/entrada');
var Creditomodels = require('../models/credito');


var currentDate = new Date();
var date = currentDate.getDate();
var month = currentDate.getMonth(); //Be careful! January is 0 not 1
var strMonts = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var monthName = strMonts[month]
var year = currentDate.getFullYear();

let fecha = date + monthName + year;

class VehiculoController {

  //obtener todos los servicios
  async getAllServicios(req, res){

    const servicios = await Serviciomodels.aggregate(
      [
        {
          $lookup:
          {
            from: "productosDetalle",
            let: {
              array : "$productos_array"
            },
            pipeline: [
              {
                $match : {
                  $expr: {
                    $in: ["$_id", "$$array"]
                  }
                }
              }
            ],
            as: "productos_array"
          }
        }
      ]
    )
    return res.status(200).send({
      success: true,
      message: 'servicios recibidas satisfactoriamente',
      servicios
    });
  }

  //Guardar Servicio
  async addServicio(req, res){

    const { 
      nro_factura_svcio, 
      descripcion_svcio, 
      es_credito_svcio, 
      otros_svcio, 
      productos_array, 
      total_precio_servicio, 
      total_precio_condescuento,
      valor_cancelado_svcio, 
      notas_garantia_svcio,
      cliente_idCliente, 
      empresa_id
    } = req.body;

    let es_estado_svcio = false;
    
    const NFact = await Serviciomodels.findOne({ nro_factura_svcio })
    if (NFact) {
      return res.status(403).send({
        success: false,
        message: 'el nro_factura_svcio ya existe'
      });
    }
    const dataEmp = await Empresamodels.findOne({ _id: empresa_id })
    if (!dataEmp) {
      return res.status(403).send({
        success: false,
        message: 'no se encontro la empresa'
      });
    }
    const dataCliente = await Clientemodels.findOne({dni_cliente: dataEmp.identificacion_empresa})
    const dataConfig = await Configuracionesmodels.findOne({empresa_id: empresa_id})
    const idClienteAnonimo=parseId(dataCliente._id)
    // console.log(dataConfig.nro_factura_svcio_inicial);

    const dataSer = await Serviciomodels.find({empresa_id})

    let nro_factura = dataConfig.nro_factura_svcio_inicial || 0; //-------------------->>>>  aqu'i iniciar'a con el 50
    // console.log(nro_factura)
    for (var i = 0; i < dataSer.length; i++) {
      if (dataSer[i].nro_factura_svcio > nro_factura) {
        nro_factura = dataSer[i].nro_factura_svcio
        console.log(nro_factura)
      }
    }

    const servicio_nuevo = new Serviciomodels({
      fecha_svcio: currentDate, 
      nro_factura_svcio: nro_factura + 1, 
      descripcion_svcio, 
      es_credito_svcio, 
      otros_svcio, 
      productos_array, 
      total_precio_servicio, 
      total_precio_condescuento: total_precio_condescuento || total_precio_servicio, 
      valor_cancelado_svcio, 
      notas_garantia_svcio,
      es_estado_svcio,
      cliente_idCliente: cliente_idCliente || idClienteAnonimo,
      empresa_id,
    })

    if (es_credito_svcio == true) {
      servicio_nuevo.valor_cancelado_svcio = valor_cancelado_svcio || 0;
      servicio_nuevo.es_estado_svcio = false;
    }
    if (es_credito_svcio == false) {
      servicio_nuevo.valor_cancelado_svcio = valor_cancelado_svcio || total_precio_servicio;
      servicio_nuevo.es_estado_svcio = true;
    }

    try {
      const saveServ = await servicio_nuevo.save();

      for (let index = 0; index < saveServ.productos_array.length; index++) {
        const cantidadProducto = saveServ.productos_array[index].cantidad
        const idProducto = saveServ.productos_array[index]._id
  
        const product = await Productomodels.findOne({_id: idProducto})
  
        const cantidadRestante=product.cantidad_producto-cantidadProducto
  
        await Productomodels.updateOne(
          { _id: idProducto},
          { $set: {"cantidad_producto": cantidadRestante}},
          (err, doc) => {
            if (err) {
              console.log(err);
            }
            if (doc !== null) {
              console.log("producto actializado")
            }
          }
        )
      }

      const saveNfactAct = await Configuracionesmodels.updateOne({ _id: dataConfig._id}, { $set: {"nro_factura_svcio_actual": saveServ.nro_factura_svcio}})
      dataEmp.arrayServicesEmp = dataEmp.arrayServicesEmp.concat(saveServ._id)
      await dataEmp.save();
      let entradaNva = new Entradamodels({
        fecha_ent: currentDate,
        valor_ent: saveServ.total_precio_condescuento,
        servicios_idServicio: saveServ._id
      });
      const saveEnt = await entradaNva.save();
      dataEmp.arrayEntEmp = dataEmp.arrayEntEmp.concat(saveEnt._id)
      // console.log(saveEnt);

      if (servicio_nuevo.es_credito_svcio == true) {

        const saldo_cr = saveServ.total_precio_condescuento - saveServ.valor_cancelado_svcio;

        // const nro_total_cuotas = req.body.nro_cuotas_totales || 1
        // const nro_cts_pagas= req.body.nro_cuotas_pagas || 1

        // const total_cuota = saldo_cr /  nro_total_cuotas

        const credito_nuevo = new Creditomodels({
          total_cr: saveServ.total_precio_condescuento,
          pago_cr: saveServ.valor_cancelado_svcio,
          saldo_cr: saldo_cr,
          // nro_cuotas_totales: nro_total_cuotas,
          // nro_cuotas_pagas: nro_cts_pagas,
          servicios_idServicio: saveServ._id,
          empresa_id: saveServ.empresa_id
        })
        const saveCredit = await credito_nuevo.save();
        dataEmp.arraycreditEmp = dataEmp.arraycreditEmp.concat(saveCredit._id)
        console.log(saveCredit);
      }
      await dataEmp.save();

      return res.status(201).send({
        success: true,
        message: "Servicio agregado",
        saveServ,
      });
    } catch (error) {
      return res.status(403).send({
        success: false,
        message: error.message
      });
    }

    // Serviciomodels.find((err, doc) => {
    //   if (err) {
    //     //console.log("error retornando servicio por id");
    //     return res.status(403).send({
    //       success: false,
    //       message: 'error retornando servicio por id'
    //     });
    //   }
    //   if (doc !== null) {
    //       //inicia consecutivo de nro facturas
    //     //si quieres iniciar con el numero 40 pones 39 en nro_factura linea 97
    //     let nro_factura = 49; //-------------------->>>>  aqu'i iniciar'a con el 50
    //     for (var i = 0; i < doc.length; i++) {
    //       if (doc[i].nro_factura_svcio > nro_factura) {
    //         nro_factura = doc[i].nro_factura_svcio
    //       }
    //     }
    //     //console.log(nro_factura);

  }

  //obtener Servicio por Id
  async getOneServicio(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    //console.log(id)

    try {
      const dataSer = await Serviciomodels.findOne({_id: id})


      // const dataSer = await Serviciomodels.aggregate(
      //   [
      //     { 
      //       $match: { 
      //         _id: parseId(id)
      //        }
      //     },
      //     {
      //       $lookup:
      //       {
      //         from: "productosDetalle",
      //         let: {
      //           array : "$productos_array"
      //         },
      //         pipeline: [
      //           {
      //             $match : {
      //               $expr: {
      //                 $in: ["$_id", "$$array"]
      //               }
      //             }
      //           }
      //         ],
      //         as: "productos_array"
      //       }
      //     }
      //   ]
      // )
      if (dataSer === null) {
        return res.status(403).send({
          success: false,
          message: 'error retornando empresa por id'
        });
      }
      return res.status(200).send({
        success: true,
        message: 'servicio encontrado exitosamente',
        dataSer
      });

    } catch (error) {
        return res.status(403).send({
          success: false,
          message: error.message
        });
    }
  }

  //obtener Servicio por Id del cliente
  async getOneServicioByIdCliente(req, res){

    if (!req.params.idCliente) {
     return res.status(400).send({
       success: false,
       message: 'idCliente es requerido',
       });
     }

    let idCliente = req.params.idCliente;
    //console.log(idCliente)



    try {
      const dataSer = await Serviciomodels.aggregate(
        [
          { 
            $match: { 
              cliente_idCliente: parseId(idCliente)
             }
          },
          {
            $lookup:
            {
              from: "productosDetalle",
              let: {
                array : "$productos_array"
              },
              pipeline: [
                {
                  $match : {
                    $expr: {
                      $in: ["$_id", "$$array"]
                    }
                  }
                }
              ],
              as: "productos_array"
            }
          }
        ]
      )
      if (dataSer === null) {
        return res.status(403).send({
          success: false,
          message: 'error retornando empresa por id'
        });
      }
      return res.status(200).send({
        success: true,
        message: 'empresa encontrada exitosamente',
        dataSer
      });

    } catch (error) {
        return res.status(403).send({
          success: false,
          message: error.message
        });
    }
  }

  //eliminar servicio por Id
  async deleteOneServicio(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;

    const dataSer = await Serviciomodels.findById({ _id: id})
    if (dataSer === null) {
      return res.status(404).send({
        success: false,
        message: 'Servicio no encontrado',
      });
    }
    const dataEmp = await Empresamodels.findById({_id : dataSer.empresa_id})
    const arraySer = dataEmp.arrayServicesEmp;
    const indexSerDelet = arraySer.indexOf(id);
    arraySer.splice(indexSerDelet, 1)

    try {
      await dataEmp.save()
      const deleteSer = await Serviciomodels.deleteOne({ _id: id})
      if (deleteSer.deletedCount === 0) {
        return res.status(404).send({
          success: false,
          message: 'Servicio no eliminado',
        });
      }else {
        return res.status(200).send({
          success: true,
          message: 'Servicio eliminado exitosamente',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  //servicios por empresa
  async getServiciosByEmp(req, res){

    if (!req.params.idEmp) {
     return res.status(400).send({
       success: false,
       message: 'idEmp es requerido',
       });
    }

    let idEmpresa = req.params.idEmp;

    try {
      const dataSer = await Serviciomodels.aggregate(
        [
          { 
            $match: { 
              empresa_id: parseId(idEmpresa)
             }
          },
          {
            $lookup:
            {
              from: "productosDetalle",
              let: {
                array : "$productos_array"
              },
              pipeline: [
                {
                  $match : {
                    $expr: {
                      $in: ["$_id", "$$array"]
                    }
                  }
                }
              ],
              as: "productos_array"
            }
          }
        ]
      )
      if (dataSer === null) {
        return res.status(403).send({
          success: false,
          message: 'error retornando empresa por id'
        });
      }
      return res.status(200).send({
        success: true,
        message: 'servicios encontrada exitosamente',
        dataSer
      });

    } catch (error) {
        return res.status(403).send({
          success: false,
          message: error.message
        });
    }


  }

  //actualizar servicio por id

  updateServicio(req, res) {
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
      }

      const id = req.params.id;
      Serviciomodels.findOne({ _id: id }, (err, doc) => {
        if (err) {
          //console.log("error retornando cliente por id");
          return res.status(403).send({
            success: false,
            message: 'id no encontrado en Servicios'
          });
        }
        if (doc !== null) {
          let servicioViejo = doc;

          if (req.body.descripcion_svcio != servicioViejo.descripcion_svcio) {
            servicioViejo.descripcion_svcio = req.body.descripcion_svcio
          }
          if (req.body.otros_svcio != servicioViejo.otros_svcio) {
            servicioViejo.otros_svcio = req.body.otros_svcio
          }
          if (req.body.notas_garantia_svcio != servicioViejo.notas_garantia_svcio) {
            servicioViejo.notas_garantia_svcio = req.body.notas_garantia_svcio
          }
          if (req.body.es_estado_svcio != servicioViejo.es_estado_svcio) {
            servicioViejo.es_estado_svcio = req.body.es_estado_svcio
          }

          Serviciomodels.updateOne(
            { _id: id},
            { $set: servicioViejo},
            (err, doc) => {
              if (err) {
                return res.status(404).send({
                  success: false,
                  message: 'Servicio no encontrado',
                });
              }
              return res.status(201).send({
                success: true,
                message: 'Servicio actualizado satisfactoriamente'
              });
            }
          )}
        else {
          //console.log("cliente no encontrado")
          return res.status(404).send({
            success: false,
            message: 'Servicio no encontrado',
            servicioViejo,
          });
        }
      })
  }

}

const vehiculoController = new VehiculoController();
module.exports = vehiculoController;
