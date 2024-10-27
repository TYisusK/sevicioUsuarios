require('dotenv').config();

function validarClave(req, res, next) {
    // Si ya se verificó la clave, permitir el acceso
    if (req.session.claveVerificada) {
        return next();
    }

    // Si la clave no ha sido verificada, redirigir a la página de ingreso de clave
    res.redirect('/usuarios/verificar-clave');
}

module.exports = validarClave;
