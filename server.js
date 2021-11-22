// express 
const Contenedor = require("./main.js");

const productos = new Contenedor("archivoDesafio.txt");

const express = require('express');

const app = express()
const PORT = 8080
const server = app.listen( PORT, () =>{
    console.log(`escuchando en el puerto ${PORT}`)
})

app.get('/productos', async (request, response) => {
    const productosArchivo = await productos.getAll();
    response.send(
        productosArchivo
    );
})
app.get('/productoRandom', async (request, response) => {
    const productoRandom = await productos.getRandom();
    response.send(
        productoRandom
    );
})

server.on('error', (error)=>{
    console.log('hubo un error'+ error )
})
