"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app")); //importamos la constante app del archivo app.ts
const config_1 = __importDefault(require("./config/config")); //importamos la constante config del archivo config.ts
const PORT = parseInt(config_1.default.PORT, 10); //obtenemos el puerto del archivo config.ts y lo almacenamos en la constante PORT
app_1.default.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`); //mostramos un mensaje en consola
});
//Punto de entrada principal de la aplicación. 
//Su función es inicializar el servidor Express y ponerlo en funcionamiento escuchando en un puerto específico.
//archivo que arranca la aplicación y la pone en funcionamiento.
