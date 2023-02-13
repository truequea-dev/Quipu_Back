// const {clienteAnonimo, clienteAnonimoDelete} = require("../helpers/clienteAnonimo");
const {parseId} = require("../helpers/parserId");
const { encrypt } = require('../helpers/handleBcrypt')
const fs = require('fs');

const Empresamodels = require('../models/empresa');
const CategoriasEmpresamodels = require('../models/categoriasEmpresa');
const Clientemodels = require('../models/cliente');
const Configuracionesmodels = require('../models/configuraciones');
const Usermodels = require('../models/user');
const tiposEmpresamodels = require('../models/tiposEmpresa');
const tiposProductomodels = require('../models/tiposProducto');
const employeesModels = require('../models/employees');
const rolesModels = require('../models/roles');
const permissionsModels = require('../models/permissions');

const currentDate = new Date();
const date = currentDate.getDate();
const month = currentDate.getMonth(); //Be careful! January is 0 not 1
const strMonts = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const monthName = strMonts[month]
const year = currentDate.getFullYear();

let fecha = date + monthName + year;

class EmpresaController {

  //obtener todas las empresas
  async getAllEmpresas(req, res){

    // const empresas = await Empresamodels.find({}).populate('arrayProductEmp')
    const empresas = await Empresamodels.aggregate(
      [
        {
          $lookup:
          {
            from: "producto",
            let: {
              array : "$arrayProductEmp"
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
            as: "arrayProductEmp"
          }
        },
        {
          $lookup:
          {
            from: "cliente",
            let: {
              array : "$arrayClientEmp"
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
            as: "arrayClientEmp"
          }
        },
        {
          $lookup:
          {
            from: "servicio",
            let: {
              array : "$arrayServicesEmp"
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
            as: "arrayServicesEmp"
          }
        },
        {
          $lookup:
          {
            from: "configuraciones",
            let: {
              array : "$arrayConfigEmp"
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
            as: "arrayConfigEmp"
          }
        },
        {
          $lookup:
          {
            from: "user",
            let: {
              array : "$arrayUsersEmp"
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
            as: "arrayUsersEmp"
          }
        },
        {
          $lookup:
          {
            from: "entrada",
            let: {
              array : "$arrayEntEmp"
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
            as: "arrayEntEmp"
          }
        },
        {
          $lookup:
          {
            from: "salida",
            let: {
              array : "$arraySalEmp"
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
            as: "arraySalEmp"
          }
        },
        {
          $lookup:
          {
            from: "credito",
            let: {
              array : "$arraycreditEmp"
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
            as: "arraycreditEmp"
          }
        },
      ]
    )
    return res.status(200).send({
      success: true,
      message: 'empresas recibidas satisfactoriamente',
      empresas,
    });
  }

  //Guardar empresas
  async addEmpresa(req, res){

    if (!req.body.nombre_empresa) {
      return res.status(403).send({
        success: false,
        message: "el campo nombre_empresa es requerido"
      })
    }
    if (!req.body.identificacion_empresa) {
      return res.status(403).send({
        success: false,
        message: "el campo identificacion_empresa es requerido y es de tipo numerico"
      })
    }
    if (!req.body.telefono_empresa) {
      return res.status(403).send({
        success: false,
        message: "el campo telefono_empresa es requerido y de tipo numerico"
      })
    }
    if (!req.body.password_admin || req.body.password_admin.length < 5) {
      return res.status(403).send({
        success: false,
        message: "el password_admin es requerido es minimo de 5 caracteres"
      })
    }

    const { 
      nombre_empresa, 
      identificacion_empresa,
      fecha_registro_empresa,
      descripcion_empresa, 
      pais_empresa, 
      ciudad_empresa, 
      direccion_empresa, 
      telefono_empresa, 
      email_empresa, 
      nro_whatsapp, 
      slogan_empresa, 
      version_paquete_empresa, 
      fecha_ultimo_mes_pago_empresa, 
      params_adicionales_1_empresa, 
      params_adicionales_2_empresa, 
      notas_empresa, 
      estado_empresa, 
      categoriasEmpresa_id, 
      tiposEmpresa_id,
      es_label_factura_activo,
      es_label_Ccobro_activo,
      es_credito__activo,
      nro_factura_svcio_inicial,
      nro_factura_svcio_actual,
      password_admin
    } = req.body;

    let pathImg = '';

    if (req.file !== undefined) {
      pathImg=`${req.file.path}`
    }

    const ifIdf = await Empresamodels.findOne({ identificacion_empresa })
    if (ifIdf) {
      return res.status(403).send({
        success: false,
        message: "la identificacion_empresa ya ha sido registrada"
      })
    }

    const ifEmail = await Empresamodels.findOne({ email_empresa })
    if (ifEmail) {
      return res.status(403).send({
        success: false,
        message: "el email_empresa ya ha sido registrado"
      })
    }

    const ifCatEmp = await CategoriasEmpresamodels.findOne({ nombre_categoria: "sin Categoria" })
    if (!ifCatEmp) {
      const newCat = new CategoriasEmpresamodels({ 
        nombre_categoria: "sin Categoria",
        descripcion_categoria: "sin Categoria"
      });
      await newCat.save();
      const newCatP = new models.CategoriasProducto({ 
        nombre_categoria: "sin Categoria",
        descripcion_categoria: "sin Categoria"
      });
      await newCatP.save();
    }
    const CatEmp = await CategoriasEmpresamodels.findOne({ nombre_categoria: "sin Categoria" })
    
    const ifTypeEmp = await tiposEmpresamodels.findOne({ nombre_type: "sin Tipo" })
    if (!ifTypeEmp) {
      const newType = new tiposEmpresamodels({ 
        nombre_type: "sin Tipo",
        descripcion_type: "sin Tipo"
       });
       await newType.save();
      const newTypeP = new tiposProductomodels({ 
        nombre_type: "sin Tipo",
        descripcion_type: "sin Tipo"
       });
       await newTypeP.save();
    }
    const TypeEmp = await tiposEmpresamodels.findOne({ nombre_type: "sin Tipo" })

    const empresa_nueva = new Empresamodels({
      nombre_empresa,
      identificacion_empresa,
      descripcion_empresa,
      fecha_registro_empresa: fecha_registro_empresa || currentDate,
      pais_empresa,
      ciudad_empresa,
      direccion_empresa,
      telefono_empresa,
      email_empresa,
      nro_whatsapp,
      slogan_empresa,
      version_paquete_empresa,
      fecha_ultimo_mes_pago_empresa : fecha_ultimo_mes_pago_empresa || currentDate,
      params_adicionales_1_empresa,
      params_adicionales_2_empresa,
      notas_empresa,
      estado_empresa,
      categoriasEmpresa_id: categoriasEmpresa_id || CatEmp._id,
      tiposEmpresa_id: tiposEmpresa_id || TypeEmp._id,
      imagePath: pathImg
    })

    try {
      const saveEmp = await empresa_nueva.save();
      const config_nueva = new Configuracionesmodels({
        es_label_factura_activo: es_label_factura_activo || true,
        es_label_Ccobro_activo: es_label_Ccobro_activo || false,
        es_credito__activo: es_credito__activo || false,
        nro_factura_svcio_inicial,
        nro_factura_svcio_actual,
        empresa_id: saveEmp._id 
      })
      await config_nueva.save();
      // clienteAnonimo(identificacion_empresa, saveEmp._id)

      const newRol = new rolesModels({ 
        rolName: "Admin",
        description: "administrador principal",
        empresa_id: empresa_nueva._id
      });
      const dataRol = await newRol.save();
      
      const newpermission = new permissionsModels({ 
        read: true,
        write: true,
        delete: true,
        update: true,
        create: true,
        Roles_idRoles: dataRol._id
      });
      await newpermission.save();
      console.log(saveEmp);
      const newEmployees = new employeesModels({
        telefono: telefono_empresa,
        name: `${nombre_empresa}Admin`,
        email: saveEmp.email_empresa,
        estado_usuario: true,
        Roles_idRoles: dataRol._id,
        Company_idCompany: saveEmp._id,
      });
      const dataEmployees = await newEmployees.save();
      
      const passwordHash = await encrypt(password_admin);
      const newUser = new Usermodels({
        usuario: saveEmp.email_empresa,
        password: passwordHash,
        Employees_idEmployees: dataEmployees._id,
      });
      await newUser.save();


      return res.status(201).send({
        success: true,
        message: "empresa agregada",
        empresa_nueva
      });
    } catch (error) {
      console.log(error);
      return res.status(403).send({
        success: false,
        message: error.message
      })
    }
  }

  //obtener empresa por Id
  async getOneEmpresa(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;

    try {
      const dataEmp = await Empresamodels.aggregate(
        [
          { 
            $match: { 
              _id: parseId(id)
             }
          },
          {
            $lookup:
            {
              from: "producto",
              let: {
                array : "$arrayProductEmp"
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
              as: "arrayProductEmp"
            }
          },
          {
            $lookup:
            {
              from: "cliente",
              let: {
                array : "$arrayClientEmp"
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
              as: "arrayClientEmp"
            }
          },
          {
            $lookup:
            {
              from: "servicio",
              let: {
                array : "$arrayServicesEmp"
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
              as: "arrayServicesEmp"
            }
          },
          {
            $lookup:
            {
              from: "configuraciones",
              let: {
                array : "$arrayConfigEmp"
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
              as: "arrayConfigEmp"
            }
          },
          {
            $lookup:
            {
              from: "user",
              let: {
                array : "$arrayUsersEmp"
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
              as: "arrayUsersEmp"
            }
          },
          {
            $lookup:
            {
              from: "entrada",
              let: {
                array : "$arrayEntEmp"
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
              as: "arrayEntEmp"
            }
          },
          {
            $lookup:
            {
              from: "salida",
              let: {
                array : "$arraySalEmp"
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
              as: "arraySalEmp"
            }
          },
          {
            $lookup:
            {
              from: "credito",
              let: {
                array : "$arraycreditEmp"
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
              as: "arraycreditEmp"
            }
          },
        ]
      )
      if (dataEmp === null) {
        return res.status(403).send({
          success: false,
          message: 'error retornando empresa por id'
        });
      }
      return res.status(200).send({
        success: true,
        message: 'empresa encontrada exitosamente',
        dataEmp
      });

    } catch (error) {
        return res.status(403).send({
          success: false,
          message: error.message
        });
    }
  }


  //eliminar empresa por Id
  async deleteOneEmpresa(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
    }

    let id = req.params.id;
    const ifEmp = await Empresamodels.findOne({_id : id})
    if (!ifEmp) {
      return res.status(404).send({
        success: false,
        message: 'empresa no encontrada',
      });
    }

    try {
      const deleteCli = await Clientemodels.deleteOne({dni_cliente: ifEmp.identificacion_empresa})
      console.log(deleteCli);
      const deleteU = await Usermodels.deleteMany({empresa_id: id})
      console.log(deleteU);
      const deleteCng = await Configuracionesmodels.deleteOne({ empresa_id: ifEmp._id})
      console.log(deleteCng);
      const deleteEmp = await Empresamodels.deleteOne({ _id: id})
      console.log(deleteEmp);
      return res.status(200).send({
        success: true,
        message: "Empresa eliminada correctamente"
      });
      
    } catch (error) {
      return res.status(404).send({
        success: false,
        message: error.message,
      });
    }
  }


  //actualizar Empresa por Id
  updateEmpresa(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

     let id = req.params.id;
     Empresamodels.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando vehiculo por id");
         return res.status(403).send({
           success: false,
           message: 'id no encontrado en empresas'
         });
       }
       if (doc !== null) {
         let empresaViejo = doc;

         if (req.body.nombre_empresa != empresaViejo.nombre_empresa) {
           empresaViejo.nombre_empresa = req.body.nombre_empresa
         }
         if (req.body.descripcion_empresa != empresaViejo.descripcion_empresa) {
           empresaViejo.descripcion_empresa = req.body.descripcion_empresa
         }
         if (req.body.pais_empresa != empresaViejo.pais_empresa) {
           empresaViejo.pais_empresa = req.body.pais_empresa
         }
         if (req.body.ciudad_empresa != empresaViejo.ciudad_empresa) {
           empresaViejo.ciudad_empresa = req.body.ciudad_empresa
         }
         if (req.body.direccion_empresa != empresaViejo.direccion_empresa) {
           empresaViejo.direccion_empresa = req.body.direccion_empresa
         }
         if (req.body.telefono_empresa != empresaViejo.telefono_empresa) {
           empresaViejo.telefono_empresa = req.body.telefono_empresa
         }

         if (req.body.email_empresa != empresaViejo.email_empresa) {
           empresaViejo.email_empresa = req.body.email_empresa
         }
         if (req.body.nro_whatsapp != empresaViejo.nro_whatsapp) {
           empresaViejo.nro_whatsapp = req.body.nro_whatsapp
         }
         if (req.body.slogan_empresa != empresaViejo.slogan_empresa) {
           empresaViejo.slogan_empresa = req.body.slogan_empresa
         }
         if (req.body.version_paquete_empresa != empresaViejo.version_paquete_empresa) {
           empresaViejo.version_paquete_empresa = req.body.version_paquete_empresa
         }
         if (req.body.params_adicionales_1_empresa != empresaViejo.params_adicionales_1_empresa) {
           empresaViejo.params_adicionales_1_empresa = req.body.params_adicionales_1_empresa
         }
         if (req.body.params_adicionales_2_empresa != empresaViejo.params_adicionales_2_empresa) {
           empresaViejo.params_adicionales_2_empresa = req.body.params_adicionales_2_empresa
         }
         if (req.body.notas_empresa != empresaViejo.notas_empresa) {
           empresaViejo.notas_empresa = req.body.notas_empresa
         }
         if (req.body.estado_empresa != empresaViejo.estado_empresa) {
           empresaViejo.estado_empresa = req.body.estado_empresa
         }
         if (req.body.categoriasEmpresa_id != empresaViejo.categoriasEmpresa_id) {
          CategoriasEmpresamodels.findOne({ _id: req.body.categoriasEmpresa_id }, (err, doc) => {
            if (err) {
                return res.status(403).send({
                  success: false,
                  message: 'id no encontrado en categoria Empresa'
                });
              }
            })
          empresaViejo.categoriasEmpresa_id = req.body.categoriasEmpresa_id
         }
         if (req.body.tiposEmpresa_id != empresaViejo.tiposEmpresa_id) {
           models.TiposEmpresa.findOne({ _id: req.body.tiposEmpresa_id }, (err, doc) => {
             if (err) {
               return res.status(403).send({
                 success: false,
                 message: 'id no encontrado en tipos Empresa'
               });
             }
           })
           empresaViejo.tiposEmpresa_id = req.body.tiposEmpresa_id
         }
           
          empresaViejo.fecha_ultimo_mes_pago_empresa = currentDate;


         Empresamodels.updateOne(
           { _id: id},
           { $set: empresaViejo},
           (err, doc) => {
             if (err) {
               return res.status(404).send({
                 success: false,
                 message: 'empresa no encontrada',
               });
             }
             return res.status(201).send({
               success: true,
               message: 'empresa actualizada satisfactoriamente',
               empresaViejo
             });
           }
         )}
       else {
         //console.log("Vehiculo no encontrado")
         return res.status(404).send({
           success: false,
           message: 'empresa detalle no encontrado',
         });
       }
     })
   }


   //obtener vehiculo y cliente por cc cliente
   getVehiculoCcCliente(req, res){

     if (!req.params.ccCliente) {
      return res.status(400).send({
        success: false,
        message: 'cc cliente es requerida',
        });
      }

     let ccCliente = req.params.ccCliente;
     //console.log(ccCliente)

     Clientemodels.findOne({ cc_cliente: ccCliente }, (err, doc) => {
       if (err) {
         //console.log("error retornando cc cliente");
         return res.status(403).send({
           success: false,
           message: 'error retornando cc cliente'
         });
       }
       if (doc !== null) {
         let cliente = doc;
         //console.log(cliente);

         let clienteId = cliente._id;
         models.Vehiculo.find({ cliente_idCliente: clienteId }, (err, doc1) => {
           if (err) {
             //console.log("error retornando vehiculo por cc cliente ln 273");
             return res.status(403).send({
               success: false,
               message: 'error retornando vehiculo por cc cliente'
             });
           }
           if (doc1 !== null) {
             let vehiculo = doc1;
             return res.status(200).send({
               success: true,
               message: 'Vehiculo encontrado exitosamente',
               vehiculo,
               cliente,
             });
           }
           else {
             //console.log("vehiculo no encontrado")
             return res.status(404).send({
               success: false,
               message: 'Vehiculo o cc no concuerdan',
             });
           }
         });
       }
       else {
         //console.log("vehiculo no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Vehiculo o cc no concuerdan',
         });
       }
     });
   }

     //obtener config por Id de emp
  getConfigEmp(req, res){

    if (!req.params.idconfig) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    const id = req.params.idconfig;
    //console.log(id)

    Configuracionesmodels.findOne({ empresa_id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando cliente por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando configuraciones por id'
        });
      }
      if (doc !== null) {
        const configuraciones = doc;
        return res.status(200).send({
          success: true,
          message: 'configuraciones encontradas exitosamente',
          configuraciones
        });
      }
      else {
        //console.log("cliente no encontrado")
        return res.status(404).send({
          success: false,
          message: 'configuraciones no encontradas',
        });
      }
    });
  }

  //actualizar configuracion por Id de emp
  updateConfigByIdEmp(req, res){

      if (!req.params.idconfig) {
       return res.status(400).send({
         success: false,
         message: 'id es requerido',
         });
       }
  
       let id = req.params.idconfig;
  
       Configuracionesmodels.findOne({ empresa_id: id }, (err, doc) => {
         if (err) {
           //console.log("error retornando Entrada por id");
           return res.status(403).send({
             success: false,
             message: 'id no encontrado en configuraciones'
           });
         }
         if (doc !== null) {
           let ConfiguracionesViejo = doc;
  
           if (req.body.es_label_factura_activo != ConfiguracionesViejo.es_label_factura_activo) {
             ConfiguracionesViejo.es_label_factura_activo = req.body.es_label_factura_activo
           }
           if (req.body.es_label_Ccobro_activo != ConfiguracionesViejo.es_label_Ccobro_activo) {
             ConfiguracionesViejo.es_label_Ccobro_activo = req.body.es_label_Ccobro_activo
           }
           if (req.body.es_credito__activo != ConfiguracionesViejo.es_credito__activo) {
             ConfiguracionesViejo.es_credito__activo = req.body.es_credito__activo
           }
           if (req.body.nro_factura_svcio_inicial != ConfiguracionesViejo.nro_factura_svcio_inicial) {
             ConfiguracionesViejo.nro_factura_svcio_inicial = req.body.nro_factura_svcio_inicial
           }
           if (req.body.nro_factura_svcio_actual != ConfiguracionesViejo.nro_factura_svcio_actual) {
             ConfiguracionesViejo.nro_factura_svcio_actual = req.body.nro_factura_svcio_actual
           }
  
           Configuracionesmodels.updateOne(
             { _id: doc},
             { $set: ConfiguracionesViejo},
             (err, doc) => {
               if (err) {
                 return res.status(404).send({
                   success: false,
                   message: 'configuracion no encontrada',
                 });
               }
               return res.status(201).send({
                 success: true,
                 message: 'configuracion actualizada satisfactoriamente',
                 ConfiguracionesViejo
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

  //actualizar logo
   async updateLogoEmp(req, res){
    if (!req.params.id) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
      }
 
    let id = req.params.id;

    const emp = await Empresamodels.findOne({ _id: id })
    if (!emp) {
      return res.status(400).send({
        success: false,
        message: 'empresa no encotrada',
        });
    }

    try {
      if (emp.imagePath) {
        fs.unlinkSync(emp.imagePath)
      }
      let pathImg = '';
      
      if (req.file !== undefined) {
        pathImg=`${req.file.path}`
      }
      
      // return console.log(pathImg)
      Empresamodels.updateOne(
        { _id: id},
        { $set: {"imagePath": pathImg}},
        (err, doc) => {
          if (err) {
            console.log(err);
          }
          if (doc !== null) {
            return res.status(200).send({
              success: true,
              message: "logo actualizado correctamente"
            });
          }
        }
      )
    } catch (error) {
      return res.status(200).send({
        success: true,
        message: error.message
      });
    }
    

  }

}

const empresaController = new EmpresaController();
module.exports = empresaController;
