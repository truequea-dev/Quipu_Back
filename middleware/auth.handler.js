function checkApiKey(req, res, next) {
    const apiKey = req.headers['apiKey'];
    console.log(req.headers);
    if (apiKey === "123") {
        next();
    }
    else {
        res.status(401).send({
            success: false,
            "error": "Unauthorized",
        });
      
    }
}

module.exports = {checkApiKey}