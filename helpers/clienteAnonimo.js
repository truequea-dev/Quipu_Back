var Empresamodels = require('../models/empresa');
var clientemodels = require('../models/cliente');

const clienteAnonimo = async (identificacion_empresa, empresa_id) => {
    const ifEmp = await Empresamodels.findOne({ _id: empresa_id })
    const cliente_nuevo = new clientemodels({
      nombres_cliente: "clienteAnonimo",
      apellidos_cliente: "clienteAnonimo",
      dni_cliente: identificacion_empresa,
      cel_cliente: "000001",
      direccion_cliente: "casaA",
      correo_cliente: "correo@correo.com",
      parametros_1_cliente: "",
      parametros_2_cliente: "",
      empresa_id: empresa_id
    })
    try {
      const saveClient = await cliente_nuevo.save()
      console.log(saveClient);
    } catch (error) {
      console.log(error);
    }
  }

const clienteAnonimoDelete = async ( id ) => {
    const anonimoDelete = await clientemodels.deleteOne({ _id: id})
    console.log("---- cliente anonimo elimindao ----", anonimoDelete);
  }

module.exports = {clienteAnonimo, clienteAnonimoDelete}