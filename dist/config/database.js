"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose")); // Importa la librería mongoose para conectarse a la base de datos
const dotenv_1 = __importDefault(require("dotenv")); // Importa la librería dotenv para cargar las variables de entorno
dotenv_1.default.config(); // Carga las variables de entorno
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try { //intenta ejecutar el codigo. intenta conectar la base de datos, si falla el catch captura el error
        const mongoURI = 'mongodb+srv://TaskManagerDatabase:12345678egg@cluster0.hvt21.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // no se puede cambiar 
        yield mongoose_1.default.connect(mongoURI); //intenta conectarse a la base de datos con la URI de conexión de mongoDB, espera que la conexion se complete antes de continuar
        console.log('MongoDB conectado'); // si la conexion es correcta, imprime en consola "MongoDB conectado"
    }
    catch (error) { //si falla la conexion a la base de datos
        console.error('Error al conectar a MongoDB:', error); //imprime en consola el error que se produjo
        process.exit(1); //Termina, detiene el proceso de node.js en ejecución
    }
});
exports.default = connectDB; //exporta la función connectDB para que pueda ser utilizada en otros archivos
