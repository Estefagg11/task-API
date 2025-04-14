"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv")); //librería de node.js que carga variables de entorno, utiles para almacenar informacion sensible
dotenv_1.default.config(); // carga las variables de entorno 
const config = {
    PORT: 5001, // asigna el valor 5001 a PORT
    JWT_SECRET: 'your-secret-key', // clave secreta para JWT, para verificar la autenticidad de los tokens
    JWT_EXPIRATION: '1d' // tiempo de expiracion de los tokens
};
exports.default = config; //exporta la constante config para que pueda ser utilizada en otros archivos
