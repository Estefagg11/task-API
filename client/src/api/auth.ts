import axios from 'axios'; 

const API = 'http://localhost:5001/api/users'; //define la URL de la base de la API a la se conecta la app
//el servidor del backend se ejecuta en el puerto 5001 y la ruta para usuarios
interface User { // define la interfaz/estructura de usuario, react-hook-form la usa para saber que campos manejar y que tipo de datos
  name: string;
  password: string;
  email: string; 
}

export const registerRequest = (user: User) => axios.post(`${API}/register`, user); 
//Es una función que envía una petición POST a la API.
//Se llama cuando el usuario se registra (desde el formulario).
//Envía el objeto user como body de la petición.

//le envía el backend un nuevo usuario para reguistrarlo en la base de datos

export const loginRequest = (user: User) => axios.post(`${API}/login`, user); 

