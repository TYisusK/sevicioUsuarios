var crypto = require("crypto");
require('dotenv').config();


function encriptarPassword(password){
    var salt=crypto.randomBytes(32).toString('hex');
    var hash=crypto.scryptSync(password, salt, 100000, 64, 'sha512').toString('hex');
    return {
        salt,
        hash
    }
}

function validarPassword(password, hash, salt){
    var hashEvaluar=crypto.scryptSync(password,salt,100000, 64, 'sha512').toString('hex');
    return hashEvaluar == hash
}

require('dotenv').config();

function validarClave(req, res, next) {
    // Si ya se verificó la clave, permitir el acceso
    if (req.session.claveVerificada) {
        return next();
    }

    // Si la clave no ha sido verificada, redirigir a la página de ingreso de clave
    res.redirect('/verificar-clave');
}




module.exports={
    encriptarPassword,
    validarPassword,
    validarClave
}