const mongoose = require('mongoose');

const DB_URL =  `mongodb://127.0.0.1:27017/inventarioDataBase`

module.exports = () => {
    const connect = () => {
        mongoose.set("strictQuery", false);
        mongoose.connect(
            DB_URL,
            {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err) => {
                if (err) {
                    console.log("error en DB", err);
                }else{
                    console.log("DB conectada correctamente")
                }
            }
        )
    }

    connect();
}