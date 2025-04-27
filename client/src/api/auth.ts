import axiosInstance from './axiosInstance'; // Importamos nuestra instancia configurada

const API_ROUTE = '/users'; // Mantenemos la ruta específica para usuarios

// La URL base ya está configurada en axiosInstance, solo añadimos la ruta específica
const API = API_ROUTE; // Ya no se necesita la URL completa aquí

interface User { // Definimos la interfaz para el usuario
  name: string; // Nombre del usuario tipo string
  surname: string; // Apellido del usuario tipo string    
  password: string; // Contraseña del usuario tipo string
  email: string; // Correo electrónico del usuario tipo string
}
interface LoginUser { 
    email: string; // Correo electrónico del usuario tipo string
    password: string; // Contraseña del usuario tipo string
}

// Usamos axiosInstance en lugar de axios
// La URL será relativa a la baseURL configurada en axiosInstance
export const registerRequest = (user: User) => // Función para registrar un nuevo usuario
  axiosInstance.post<any>(`${API}/register`, user); // Enviamos una solicitud POST a la ruta de registro con los datos del usuario

export const loginRequest = (user: LoginUser) => // Función para iniciar sesión
  axiosInstance.post<any>(`${API}/login`, user); // Enviamos una solicitud POST a la ruta de inicio de sesión con los datos del usuario
 

