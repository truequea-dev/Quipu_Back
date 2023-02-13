const {sendMail} = require("../config/emailer");
const multer = require('multer');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

exports.upload = upload.single('myFile')

exports.sendServByEmail = (req, res) => {
    const {email, id} = req.body;
    if (!email) {
      return res.status(403).send({
        success: false,
        message: "el campo email es requerido"
      });
    }
    try {
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(`uploads/${id}.pdf`));
      doc.image(`uploads/${id}.png`, 0, 5, {
        width: 615,
        align: 'center',
        valign: 'center'
      });
      doc.end();
      sendMail(email, id).then(() => {
        fs.unlinkSync(`uploads/${id}.png`)
        console.log("img eliminada");
        fs.unlinkSync(`uploads/${id}.pdf`)
        console.log("pdf eliminad0");
      })
      return res.status(200).send({
        success: true,
        message: "correo enviado exitosamente"
      });
    } catch (error) {
      return res.status(403).send({
        success: false,
        message: error.message
      });
    }
}