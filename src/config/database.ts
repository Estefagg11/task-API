
import mongoose from 'mongoose';// Importa la librería mongoose para conectarse a la base de datos
import dotenv from 'dotenv';// Importa la librería dotenv para cargar las variables de entorno

dotenv.config(); // Carga las variables de entorno

const connectDB = async (): Promise<void> => { // Función asíncronica llamada connectDB que no retorna ningun valor, la función connectDB realizará una acción asíncrona (como conectar a la base de datos), pero no devuelve un valor, solo asegura que la operación se complete. 
  try {//intenta ejecutar el codigo. intenta conectar la base de datos, si falla el catch captura el error
    const mongoURI: string = 'mongodb+srv://TaskManagerDatabase:12345678egg@cluster0.hvt21.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';// no se puede cambiar 
    await mongoose.connect(mongoURI);//intenta conectarse a la base de datos con la URI de conexión de mongoDB, espera que la conexion se complete antes de continuar
    console.log('MongoDB conectado');// si la conexion es correcta, imprime en consola "MongoDB conectado"
  } catch (error) { //si falla la conexion a la base de datos
    console.error('Error al conectar a MongoDB:', error); //imprime en consola el error que se produjo
    process.exit(1);//Termina, detiene el proceso de node.js en ejecución
  }
};

export default connectDB; //exporta la función connectDB para que pueda ser utilizada en otros archivos