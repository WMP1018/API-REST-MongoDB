//Paquetes utilizados para el proyecto
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

//Se instancia a express como app
const app = express();
app.use(cors());
app.use(express.json());

//Se crea una constante para cargar la URI de conexion al cluster en Mongo Atlas
const mongoUri = process.env.MONGODB_URI;
//Se establece conexion con la BD MongoDB
try {
    mongoose.connect(mongoUri);
    console.log("Conectado a MongoDB");
} catch (error) {
    console.error("Error de conexion",error);
}
const db = mongoose.connection;

//Se crea el esquema para el modelo a trabajar, para determinar su estructura
const galletaSchema = new mongoose.Schema({
    nombre: String,
    tipo: String,
});
//Se crea el modelo basado en el esquema anterior
const Galleta = mongoose.model("Galleta", galletaSchema);

//Se empezarán a crear las rutas para la API con ayuda de Express
//Ruta raíz
app.get("/", (req, res) => {
    res.send("Bienvenido Cookie Brown... un deleite a tu paladar");
});

//Se levanta el servidor de Node para probar la ruta raiz
app.listen(5000, () => {
    console.log("Servidor ejecutándose en http://localhost:5000/");
});

//Ruta para crear una nueva entrada
app.post("/galletas", async (req, res) => {
    const galleta = new Galleta({
        nombre: req.body.nombre,
        tipo: req.body.tipo,
    });

    try {
        await galleta.save();
        res.json(galleta);
    } catch (error) {
        res.status(500).send("Error al guardar la galleta");
    }
});

//Ruta para consultar todas las entrada ingresadas
app.get("/galletas", async (req, res) => {
    try {
        const galletas = await Galleta.find();
        res.json(galletas);
    } catch (error) {
        res.status(500).send("Error al obtener las galletas");
    }
});

//Ruta para actualizar una entrada según su ID
app.put("/galletas/:id", async (req, res) => {
    try {
        const galleta = await Galleta.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                tipo: req.body.tipo,
            },
            {new: true}
        );
        if(galleta){
            res.json(galleta);
        } else {
            res.status(404).send("Galleta no encontrada");
        }
    } catch (error) {
        res.status(500).send("Error al actualizar la galleta");
    }
})

//Ruta para eliminar una entrada según su ID
app.delete("/galletas/:id", async (req, res) => {
    try {
        const galleta = await Galleta.findByIdAndDelete(req.params.id);
        if(galleta){
            res.status(204).send();
        } else {
            res.status(404).send("Galleta no encontrada");
        }
    } catch (error) {
        res.status(500).send("Error al eliminar la galleta");
    }
})