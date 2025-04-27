import axios from 'axios'; // Importamos axios para realizar peticiones HTTP

// Usa la misma URL base que definiste en auth.ts
const API_BASE_URL = 'http://localhost:5001/api'; // URL base de la API

const axiosInstance = axios.create({ // Creamos una instancia de axios con configuración personalizada
  baseURL: API_BASE_URL, // URL base para todas las peticiones
});


axiosInstance.interceptors.request.use( // Interceptor para añadir el token a las peticiones salientes
  (config) => {// Lee el token directamente de localStorage ANTES de enviar la petición
    const token = localStorage.getItem('token'); // Usa la misma clave 'token' que en AuthContext

    if (token) {// Si existe el token, lo añade a la cabecera Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Devuelve la configuración modificada (o la original si no había token)
  },
  (error) => { // Manejo de errores del interceptor (poco común para errores de request)
    return Promise.reject(error); // Devuelve el error para que pueda ser manejado 
  }
);

export default axiosInstance; // Exportamos la instancia de axios para usarla en otros módulos