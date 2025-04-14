"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//app núcleo de la configuración de la aplicación
const express_1 = __importDefault(require("express")); //importamos express y la interfaz Application
const cors_1 = __importDefault(require("cors")); //importamos la libreria cors
const morgan_1 = __importDefault(require("morgan")); //importamos la libreria morgan
const database_1 = __importDefault(require("./config/database")); //importamos la funcion connectDB del archivo database.ts
const user_routes_1 = __importDefault(require("./routes/user.routes")); //importamos las rutas de usuario del archivo user.routes.ts
const task_routes_1 = __importDefault(require("./routes/task.routes")); //importamos las rutas de tarea del archivo task.routes.ts
const error_middleware_1 = require("./middleware/error.middleware"); //importamos el middleware de error del archivo error.middleware.ts
const app = (0, express_1.default)(); //creamos una instancia de express y la almacenamos en la constante app
(0, database_1.default)(); //llamamos a la funcion connectDB para conectarnos a la base de datos
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', //permitimos peticiones de cualquier origen
})); //usamos cors para permitir peticiones de otros dominios
app.use((0, morgan_1.default)('dev')); //usamos morgan con el formato dev para mostrar los logs de las peticiones en consola
app.use(express_1.default.json()); //usamos express.json para poder recibir y enviar datos en formato json
app.use('/api/users', user_routes_1.default); //usamos las rutas de usuario en la ruta /api/users
app.use('/api/tasks', task_routes_1.default); //usamos las rutas de tarea en la ruta /api/tasks
app.use(error_middleware_1.errorMiddleware); //usamos el middleware de error para manejar los errores
exports.default = app; //exportamos la constante app
//punto de configuración principal de la aplicación Express. 
//Su función es inicializar y configurar el servidor, incluyendo middlewares, rutas y la conexión a la base de datos.
