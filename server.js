// express 
const Contenedor = require("./main.js");

const productos = new Contenedor("archivoDesafio.txt");

const express = require('express');
const { Router } = express

const app = express()
const PORT = 8080
const router = Router();
const server = app.listen(process.env.PORT || PORT);

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


router.get('/productos', async (request, response) => {
    const productosArchivo = await productos.getAll();
    response.json(
        JSON.parse(productosArchivo)
    );
})

router.get('/productos/:id', async (request, response) => {
    const id = request.params.id
    let mensaje = {}
    if(await productos.getById(id)){
        const productoArchivo = await productos.getById(id);
        mensaje = {"producto" : productoArchivo } 
    }else{
        mensaje = {'error' : 'no existe ese producto'}
    }
    response.json(mensaje)
})

router.get('/productoRandom', async (request, response) => {
    const productoRandom = await productos.getRandom();
    response.json(
        productoRandom
    );

})


router.post('/productos', async (request, response) => {
    const producto = request.body;
    const idNuevoProducto = await productos.save(producto)
    response.json(
        idNuevoProducto.toString()
    );
})

router.put('/productos/:id' , async (request , response) => {
    const id = request.params.id
    let mensaje = ''
    if(await productos.getById(id)){
        const productoActualizado = request.body;
        await productos.updateItem(productoActualizado, id)
        mensaje = {'actualizado' :'se actualizo'}
    }else{
        mensaje = {'error' : 'no existe ese producto'}
    }
    response.json(mensaje)
})
router.delete('/productos/:id' , async (request , response) => {
    const id = request.params.id
    let mensaje = ''
    if(await productos.getById(id)){
        await productos.deleteById(id)
        mensaje = {"eliminado" : 'se elimino'}
    }else{
        mensaje = {'error' : 'no existe ese producto'}
    }
    response.json(mensaje)
})


server.on('error', (error)=>{
    console.log('hubo un error'+ error )
})

app.use(express.static('public'));
app.use("/api", router)