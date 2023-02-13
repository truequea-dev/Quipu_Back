const Clientemodels = require('../models/cliente');

class ClienteController {

  //obtener todos los clientes
  getAllClientes(req, res){

    Clientemodels.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando clientes");
        return;
      }
      if (doc !== null) {
        let clientes = doc;
        //console.log("listado de clientes");
        //console.log(doc);
        return res.status(200).send({
          success: true,
          message: 'Clientes recibidos satisfactoriamente',
          clientes,
        });
      }
      else {
        console.log("Clientes no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno clientes'
        });
      }
    });

  }

  //Guardar clientes
  async addCliente(req, res){

    const { nombres_cliente, apellidos_cliente="", dni_cliente, cel_cliente="", direccion_cliente="", correo_cliente="", parametros_1_cliente="", parametros_2_cliente="", empresa_id } = req.body

    const ifDni = await Clientemodels.findOne({ dni_cliente })
    if (ifDni) {
      return res.status(403).send({
        success: false,
        message: "dni_cliente ya ha sido registrado"
      })
    }
    const ifEmp = await models.Empresa.findOne({ _id: empresa_id })
    if (!ifEmp) {
      return res.status(403).send({
        success: false,
        message: 'id no encontrado en Empresa'
      });
    }

    const cliente_nuevo = new Clientemodels({
      nombres_cliente,
      apellidos_cliente,
      dni_cliente,
      cel_cliente,
      direccion_cliente,
      correo_cliente,
      parametros_1_cliente,
      parametros_2_cliente,
      empresa_id
    })

    try {
      const saveClient = await cliente_nuevo.save()
      ifEmp.arrayClientEmp = ifEmp.arrayClientEmp.concat(saveClient._id)
      await ifEmp.save();
      return res.status(201).send({
        success: true,
        message: "cliente agregado",
        saveClient
      });
    } catch (error) {
        return res.status(403).send({
          success: false,
          message: error.message
        })
    }
  }

  //obtener cliente por Id
  getOneCliente(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    const id = req.params.id;
    //console.log(id)

    Clientemodels.findOne({ _id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando cliente por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando cliente por id'
        });
      }
      if (doc !== null) {
        const cliente = doc;
        return res.status(200).send({
          success: true,
          message: 'Cliente encontrado exitosamente',
          cliente,
        });
      }
      else {
        //console.log("cliente no encontrado")
        return res.status(404).send({
          success: false,
          message: 'Cliente no encontrado',
        });
      }
    });
  }


  //eliminar cliente por Id
  async deleteOneCliente(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    const dataClient = await Clientemodels.findById({ _id: id})
    if (dataClient === null) {
      return res.status(404).send({
        success: false,
        message: 'cliente no encontrado',
      });
    }

    const dataEmp = await models.Empresa.findById({_id : dataClient.empresa_id})
    const arrayClient = dataEmp.arrayClientEmp;
    const indexClientDelet = arrayClient.indexOf(id);
    arrayClient.splice(indexClientDelet, 1)

    try {
      await dataEmp.save()
      const deleteClient = await Clientemodels.deleteOne({ _id: id})
      if (deleteClient.deletedCount === 0) {
        return res.status(404).send({
          success: false,
          message: 'cliente no eliminado',
        });
      }else {
        return res.status(200).send({
          success: true,
          message: 'cliente eliminado exitosamente',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  //actualizar cliente por Id
  updateCliente(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

     let id = req.params.id;
     Clientemodels.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando cliente por id");
         return res.status(403).send({
           success: false,
           message: 'id no encontrado en clientes'
         });
       }
       if (doc !== null) {
         let clienteViejo = doc;



         if (req.body.nombres_cliente != clienteViejo.nombres_cliente) {
           clienteViejo.nombres_cliente = req.body.nombres_cliente
         }
         if (req.body.apellidos_cliente != clienteViejo.apellidos_cliente) {
           clienteViejo.apellidos_cliente = req.body.apellidos_cliente
         }
         if (req.body.dni_cliente != clienteViejo.dni_cliente) {
           clienteViejo.dni_cliente = req.body.dni_cliente
         }
         if (req.body.cel_cliente != clienteViejo.cel_cliente) {
           clienteViejo.cel_cliente = req.body.cel_cliente
         }
         if (req.body.direccion_cliente != clienteViejo.direccion_cliente) {
           clienteViejo.direccion_cliente = req.body.direccion_cliente
         }
         if (req.body.correo_cliente != clienteViejo.correo_cliente) {
           clienteViejo.correo_cliente = req.body.correo_cliente
         }
         if (req.body.parametros_1_cliente != clienteViejo.parametros_1_cliente) {
           clienteViejo.parametros_1_cliente = req.body.parametros_1_cliente
         }
         if (req.body.parametros_2_cliente != clienteViejo.parametros_2_cliente) {
           clienteViejo.parametros_2_cliente = req.body.parametros_2_cliente
         }
         if (req.body.empresa_id != clienteViejo.empresa_id) {
            models.Empresa.findOne({ _id: req.body.empresa_id }, (err, doc) => {
              if (err) {
                return res.status(403).send({
                  success: false,
                  message: 'id no encontrado en Empresa'
                });
              }
            })
            clienteViejo.empresa_id = req.body.empresa_id
         }

         Clientemodels.updateOne(
           { _id: id},
           { $set: clienteViejo},
           (err, doc) => {
             if (err) {
               return res.status(404).send({
                 success: false,
                 message: 'Cliente no encontrado',
               });
             }
             return res.status(201).send({
               success: true,
               message: 'Cliente actualizado satisfactoriamente'
             });
           }
         )}
       else {
         //console.log("cliente no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Cliente detalle no encontrado',
           clienteViejo,
         });
       }
     })
   }

   //obtener cliente por dni
  getOneClienteDni(req, res){

     if (!req.params.dni) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
      }

     const dni = req.params.dni;
    //  console.log(cc)

     Clientemodels.findOne({ dni_cliente: dni }, (err, doc) => {
       if (err) {
         //console.log("error retornando cliente por id");
         return res.status(403).send({
           success: false,
           message: 'error retornando cliente por dni'
         });
       }
       if (doc !== null) {
         let cliente = doc;
         return res.status(200).send({
           success: true,
           message: 'Cliente encontrado exitosamente',
           cliente,
         });
       }
       else {
         //console.log("cliente no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Cliente no encontrado',
         });
       }
     });
  }

   //obtener cliente por idEmp
  getOneClienteByIdEmp(req, res){

     if (!req.params.idemp) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
      }

     const idEmp = req.params.idemp;

     Clientemodels.find({ empresa_id: idEmp }, (err, doc) => {
       if (err) {
         return res.status(403).send({
           success: false,
           message: 'error retornando clientes por idEmp'
         });
       }
       if (doc !== null) {
         let clientes = doc;
         return res.status(200).send({
           success: true,
           message: 'Clientes encontrado exitosamente',
           clientes
         });
       }
       else {
         return res.status(404).send({
           success: false,
           message: 'Clientes no encontrado',
         });
       }
     });
  }


   //eliminar cliente por dni
  async deleteOneClienteDni(req, res){

    if (!req.params.dni) {
     return res.status(400).send({
       success: false,
       message: 'dni es requerido',
       });
     }

     const dni = req.params.dni;

     const dataClient = await Clientemodels.findOne({ dni_cliente: dni})
     if (dataClient === null) {
       return res.status(404).send({
         success: false,
         message: 'cliente no encontrado',
       });
     }

     const id = dataClient._id

     const dataEmp = await models.Empresa.findById({_id : dataClient.empresa_id})
     const arrayClient = dataEmp.arrayClientEmp;
     const indexClientDelet = arrayClient.indexOf(id);
     arrayClient.splice(indexClientDelet, 1)
 
     try {
       await dataEmp.save()
       const deleteClient = await Clientemodels.deleteOne({ _id: id})
       if (deleteClient.deletedCount === 0) {
         return res.status(404).send({
           success: false,
           message: 'cliente no eliminado',
         });
       }else {
         return res.status(200).send({
           success: true,
           message: 'cliente eliminado exitosamente',
         });
       }
     } catch (error) {
       console.log(error);
     }
  }


   //actualizar cliente por Dni
  updateClienteDni(req, res){

     if (!req.params.dni) {
      return res.status(400).send({
        success: false,
        message: 'dni es requerido',
        });
      }

      const dni = req.params.dni;
      Clientemodels.findOne({ dni_cliente: dni }, (err, doc) => {
        if (err) {
          //console.log("error retornando cliente por id");
          return res.status(403).send({
            success: false,
            message: 'dni no encontrado en clientes'
          });
        }
        if (doc !== null) {
          let clienteViejo = doc;

          if (req.body.nombres_cliente != clienteViejo.nombres_cliente) {
            clienteViejo.nombres_cliente = req.body.nombres_cliente
          }
          if (req.body.apellidos_cliente != clienteViejo.apellidos_cliente) {
            clienteViejo.apellidos_cliente = req.body.apellidos_cliente
          }
          if (req.body.dni_cliente != clienteViejo.dni_cliente) {
            clienteViejo.dni_cliente = req.body.dni_cliente
          }
          if (req.body.cel_cliente != clienteViejo.cel_cliente) {
            clienteViejo.cel_cliente = req.body.cel_cliente
          }
          if (req.body.direccion_cliente != clienteViejo.direccion_cliente) {
            clienteViejo.direccion_cliente = req.body.direccion_cliente
          }
          if (req.body.correo_cliente != clienteViejo.correo_cliente) {
            clienteViejo.correo_cliente = req.body.correo_cliente
          }
          if (req.body.parametros_1_cliente != clienteViejo.parametros_1_cliente) {
            clienteViejo.parametros_1_cliente = req.body.parametros_1_cliente
          }
          if (req.body.parametros_2_cliente != clienteViejo.parametros_2_cliente) {
            clienteViejo.parametros_2_cliente = req.body.parametros_2_cliente
          }
          if (req.body.empresa_id != clienteViejo.empresa_id) {
            models.Empresa.findOne({ _id: req.body.empresa_id }, (err, doc) => {
              if (err) {
                return res.status(403).send({
                  success: false,
                  message: 'id no encontrado en Empresa'
                });
              }
            })
            clienteViejo.empresa_id = req.body.empresa_id
         }

          Clientemodels.updateOne(
            { dni_cliente: dni},
            { $set: clienteViejo},
            (err, doc) => {
              if (err) {
                return res.status(404).send({
                  success: false,
                  message: 'Cliente no encontrado',
                });
              }
              return res.status(201).send({
                success: true,
                message: 'Cliente actualizado satisfactoriamente'
              });
            }
          )}
        else {
          //console.log("cliente no encontrado")
          return res.status(404).send({
            success: false,
            message: 'Cliente detalle no encontrado',
            clienteViejo,
          });
        }
      })
  }


}

const clienteController = new ClienteController();
module.exports = clienteController;
