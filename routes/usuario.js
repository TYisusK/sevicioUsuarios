var ruta=require("express").Router();
var subirArchivo=require("../middlewares/subirArchivo");
var { nuevoUsuario, mostrarUsuarios, modificarUsuario, borrarUsario, buscarPorID, login}=require("../database/usuarios");
var validarClave = require("../middlewares/validarClave");



ruta.get("/registrarse", async (req, res) => {
    res.render("registro");
});


ruta.get("/",(req,res)=>{
    res.render("login");
});

ruta.post("/login",async(req,res)=>{
    var user=await login(req.body);
    if (user==undefined){
        res.redirect("/productos/almacen");
    }
    else{
     
        req.session.usuario=req.body.usuario;
        res.redirect("/usuarios/usuarios");            
        
        
    }
});

ruta.get("/verificar-clave", (req, res) => {
    res.render("verificarClave", { error: null }); // Pasamos error como null inicialmente
});

ruta.post("/verificar-clave", (req, res) => {
    const { clave } = req.body;
    if (clave === process.env.SECRET_KEY) {
        req.session.claveVerificada = true;
        return res.redirect(req.session.rutaIntentada || "/usuarios/usuarios");
    } else {
        res.render("verificarClave", { error: "Clave incorrecta. Inténtalo nuevamente." });
    }
});


ruta.post("/nuevousuario", subirArchivo(), async (req, res) => {
    console.log("Datos recibidos:", req.body);
    console.log("Archivo recibido:", req.file);

    if (req.file) {
        req.body.foto = req.file.originalname;
    } else {
        console.error("Archivo no subido");
    }

    try {
        const error = await nuevoUsuario(req.body);
        if (error) {
            console.error("Error al crear el usuario:", error);
            return res.status(500).send("No se pudo crear el usuario");
        }
        res.redirect("/usuarios/login");
    } catch (err) {
        console.error("Error inesperado en nuevoUsuario:", err);
        res.status(500).send("Error inesperado");
    }
});

ruta.get("/usuarios", validarClave, async (req, res) => {
    var usuarios = await mostrarUsuarios();
    res.render("administrarU", { usuarios });
});

ruta.get("/editar/:id",validarClave,async(req, res)=>{
    var user=await buscarPorID(req.params.id);
    res.render("editar",{user});
});
ruta.post("/editar", subirArchivo(), async (req, res) => {
    if (req.file != undefined) {
        req.body.foto = req.file.originalname;
    } else {
        req.body.foto = req.body.fotoVieja;
    }
    var error = await modificarUsuario(req.body);
    if (error) {
        console.error('Error modifying user:', error);
        return res.redirect("/usuarios/editar"); // Cambiar esta línea
    }
    res.redirect("/usuarios/usuarios");
});

ruta.get("/borrar/:id", async(req,res)=>{
    await borrarUsario(req.params.id);
    res.redirect("/usuarios/usuarios");
});


module.exports=ruta;