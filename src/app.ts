//app núcleo de la configuración de la aplicación
import express, { Application } from 'express';//importamos express y la interfaz Application
import cors from 'cors';//importamos la libreria cors
import morgan from 'morgan';//importamos la libreria morgan
import connectDB from './config/database';//importamos la funcion connectDB del archivo database.ts
import userRoutes from './routes/user.routes';//importamos las rutas de usuario del archivo user.routes.ts
import taskRoutes from './routes/task.routes';//importamos las rutas de tarea del archivo task.routes.ts
import { errorMiddleware } from './middleware/error.middleware'; //importamos el middleware de error del archivo error.middleware.ts




const app: Application = express(); //creamos una instancia de express y la almacenamos en la constante app


connectDB(); //llamamos a la funcion connectDB para conectarnos a la base de datos


app.use(cors({
    origin: 'http://localhost:5173', //permitimos peticiones de cualquier origen
})); //usamos cors para permitir peticiones de otros dominios
app.use(morgan('dev')); //usamos morgan con el formato dev para mostrar los logs de las peticiones en consola
app.use(express.json()); //usamos express.json para poder recibir y enviar datos en formato json


app.use('/api/users', userRoutes); //usamos las rutas de usuario en la ruta /api/users
app.use('/api/tasks', taskRoutes); //usamos las rutas de tarea en la ruta /api/tasks


app.use(errorMiddleware); //usamos el middleware de error para manejar los errores


  

export default app; //exportamos la constante app

//punto de configuración principal de la aplicación Express. 
//Su función es inicializar y configurar el servidor, incluyendo middlewares, rutas y la conexión a la base de datos.