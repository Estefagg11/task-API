
import dotenv from 'dotenv'; //librería de node.js que carga variables de entorno, utiles para almacenar informacion sensible

dotenv.config();// carga las variables de entorno 

interface Config {//define la estructura de un objeto, especificando qué propiedades y tipos debe tener.
  PORT: string | number; //define que PORT puede ser un string o un numero
  JWT_SECRET: string; //define que JWT_SECRET es un string
  JWT_EXPIRATION: string; //define que JWT_EXPIRATION es un string
}

const config: Config = {//declara una constante config que debe cumplir con la interfaz Config, asegurando que el objeto de configuración tenga las propiedades y tipos correctos definidos en la interfaz.
  PORT:  5001, // asigna el valor 5001 a PORT
  JWT_SECRET:  'your-secret-key', // clave secreta para JWT, para verificar la autenticidad de los tokens
  JWT_EXPIRATION: '1d' // tiempo de expiracion de los tokens
};

export default config; //exporta la constante config para que pueda ser utilizada en otros archivos