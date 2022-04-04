const fs = require('fs')

class Contenedor {
    constructor(name){
        this.nameFile = name,
        this.file = []
    }

    async read(){
        try{
            const contenido = await fs.promises.readFile(this.nameFile, "utf-8");
            const listaDeProductos = JSON.parse(contenido);
            this.file = listaDeProductos;
            return contenido;
        }catch(err){ // error en la lectura de archivo
            const contenido = await fs.promises.writeFile(this.nameFile, '');
            return contenido;
        }
    }
    
    async save(producto){
        try {
            const contenido =  await this.read(); // uso contenido para ver si esta vacio el archivo
            if (contenido == undefined) {
                producto.id = 1;
                this.file.push(producto);
            }else {
                let pos = this.file.length - 1 ;
                producto.id =  this.file[pos].id + 1;
                this.file.push(producto);
            }
            const productosString = JSON.stringify(this.file, null, 2);
            await fs.promises.writeFile(this.nameFile, productosString);
            console.log(producto.id)
            return producto.id;

        } catch (error) {
            return error; // error al leer o en el proceso de guardar
        }
    }
    async getById(idProducto){
        try{
            await this.read();
            const item = this.file.find(producto => producto.id == idProducto);
            if(item){
                return item;
            }else{
                return null;
            }
        }catch(error){
            return error;
        }
    }
    async getAll(){
        try{
            const listaDeProductos = await this.read();
            if(listaDeProductos){
                return listaDeProductos
            }else{
                return []
            }
        }catch (error){
            return error ;
        }
    }

    async updateItem(productoNuevo, idProducto) {
        const { title, price, thumbnail } = productoNuevo;
        try {
            await this.read();
            const contenidoActualizado = this.file.map(producto => {
                if (producto.id == idProducto) {
                    const productoActualizado = {
                        ...producto,
                        title : title,
                        price : price,
                        thumbnail : thumbnail 
                    }
                    return productoActualizado;
                }
                return producto;
            });
            const contenidoActualizadoString = JSON.stringify(contenidoActualizado, null, 2);
            await fs.promises.writeFile(this.nameFile, contenidoActualizadoString);
        } catch (error) {
            return error;
        }
    }
    async deleteById(idProducto) {
        try{
            await this.read();
            const productoEliminar = this.file.find(producto => producto.id == idProducto);
            if(productoEliminar){
                const listaDeProductosNueva = this.file.filter(producto => producto.id != idProducto);
                const productosString = JSON.stringify(listaDeProductosNueva, null, 2);
                fs.promises.writeFile(this.nameFile, productosString);
            }
        }catch(error){
            return error;
        }
    }
    
    async deleteAll() {
        try {
            await fs.promises.writeFile(this.nameFile, "");
        } catch (error) {
            return error;
        }
    }
    async getRandom(){
        try{
            await this.read();
            return this.file[(Math.floor(Math.random() * (this.file.length)))];
        }catch(err){
            return err;
        }
    }
}

module.exports = Contenedor;