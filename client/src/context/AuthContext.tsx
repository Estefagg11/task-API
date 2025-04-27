import { createContext, useState, useContext, useEffect } from 'react'; // Importamos hooks y funciones de React
import { registerRequest, loginRequest } from '../api/auth'; // Funciones para interactuar con la API de autenticación
import axiosInstance from '../api/axiosInstance'; // Instancia de Axios configurada para solicitudes HTTP
import { User } from '../types/user'; // Importamos la interfaz User desde types/user

// Interfaz para definir el contexto de autenticación
interface AuthContextType {
  user: User | null; // Usuario autenticado o null si no hay sesión
  signup: (user: any) => Promise<void>; // Función para registrar un usuario
  signin: (user: any) => Promise<void>; // Función para iniciar sesión
  logout: () => void; // Función para cerrar sesión
  isAuthenticated: boolean; // Indica si el usuario está autenticado
  errors: string[]; // Lista de errores relacionados con autenticación
  loading: boolean; // Indica si se está cargando información de autenticación
}

// Creamos el contexto de autenticación
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext); // Obtenemos el contexto
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider'); // Error si no se usa dentro de un AuthProvider
  }
  return context; // Retornamos el contexto
};

// Componente proveedor del contexto de autenticación
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Estado para el usuario autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para indicar si el usuario está autenticado
  const [errors, setErrors] = useState<string[]>([]); // Estado para almacenar errores
  const [loading, setLoading] = useState(true); // Estado para indicar si se está cargando información

  // Función para registrar un usuario 
  const signup = async (userData: any): Promise<void> => {
    try {
      const res = await registerRequest(userData); // Enviamos los datos de registro a la API
      console.log("Register Response:", res.data); // Log de la respuesta
      if (res.data.token) { // Si la API devuelve un token
         localStorage.setItem('token', res.data.token); // Guardamos el token en localStorage
         const { password, token, ...userDataWithoutSensitiveData } = res.data.user || res.data; // Excluimos datos sensibles
         setUser(userDataWithoutSensitiveData); // Guardamos el usuario en el estado
         setIsAuthenticated(true); // Marcamos al usuario como autenticado
         setErrors([]); // Limpiamos errores
      } else {
         console.warn("Registro exitoso, pero no se recibió token para auto-login."); // Advertencia si no hay token
         setErrors([]); // Limpiamos errores
      }
    } catch (error: any) {
      console.error("Signup Error:", error.response); // Log de errores
      if (error.response && error.response.data) { // Manejo de errores de la API
          const errorData = error.response.data;
          if (Array.isArray(errorData)) { setErrors(errorData); }
          else if (typeof errorData === 'string') { setErrors([errorData]); }
          else if (errorData.message) { setErrors([errorData.message]); }
          else { setErrors(["Error en el registro."]); }
      } else { setErrors(["Error desconocido en el registro."]); }
      setUser(null); // Limpiamos el usuario
      setIsAuthenticated(false); // Marcamos como no autenticado
    }
  };

  // Función para iniciar sesión 
  const signin = async (userData: any): Promise<void> => {
    try {
      const res = await loginRequest(userData); // Enviamos los datos de inicio de sesión a la API
      console.log("Login Response:", res.data); // Log de la respuesta
      if (res.data.token) { // Si la API devuelve un token
          localStorage.setItem('token', res.data.token); // Guardamos el token en localStorage
          const userPayload = res.data.user || res.data; // Obtenemos los datos del usuario
          const { token, password, ...userDataWithoutSensitiveData } = userPayload; // Excluimos datos sensibles
          setUser(userDataWithoutSensitiveData); // Guardamos el usuario en el estado
          setIsAuthenticated(true); // Marcamos al usuario como autenticado
          setErrors([]); // Limpiamos errores
      } else {
          console.error('Login exitoso pero no se recibió token.'); // Advertencia si no hay token
          setErrors(['Error inesperado al iniciar sesión.']); // Error genérico
          setUser(null); // Limpiamos el usuario
          setIsAuthenticated(false); // Marcamos como no autenticado
      }
    } catch (error: any) {
      console.error("Signin Error:", error.response); // Log de errores
      if (error.response && error.response.data) { // Manejo de errores de la API
        const errorData = error.response.data;
        if (Array.isArray(errorData)) { setErrors(errorData); }
        else if (typeof errorData === 'string') { setErrors([errorData]); }
        else if (errorData.message) { setErrors([errorData.message]); }
        else { setErrors(["Email o contraseña incorrectos."]); }
      } else { setErrors(["Error desconocido al iniciar sesión."]); }
      setUser(null); // Limpiamos el usuario
      setIsAuthenticated(false); // Marcamos como no autenticado
    }
  };

  // Función para cerrar sesión 
  const logout = () => {
    console.log("Ejecutando logout..."); // Log de cierre de sesión
    localStorage.removeItem('token'); // Eliminamos el token de localStorage
    setUser(null); // Limpiamos el usuario
    setIsAuthenticated(false); // Marcamos como no autenticado
  };

  //Manejo de errores con temporizador 
  useEffect(() => {
    if (errors.length > 0) { // Si hay errores
      const timer = setTimeout(() => {
        setErrors([]); // Limpiamos errores después de 5 segundos
      }, 5000);
      return () => clearTimeout(timer); // Limpiamos el temporizador al desmontar
    }
  }, [errors]);

  // Verificación del estado de autenticación al cargar la app 
  useEffect(() => {
    async function checkLoginStatus() {
      const token = localStorage.getItem('token'); // Obtenemos el token de localStorage

      if (!token) { // Si no hay token
        setIsAuthenticated(false); // Marcamos como no autenticado
        setUser(null); // Limpiamos el usuario
        setLoading(false); // Marcamos como cargado
        return;
      }

      try {
        console.log("Verificando token existente usando /tasks..."); // Log de verificación
        const response = await axiosInstance.get('/tasks'); // Verificamos el token con una solicitud a la API
        console.log("Llamada a /tasks exitosa, token válido. Respuesta:", response.data); // Log de éxito
        setIsAuthenticated(true); // Marcamos como autenticado
        setUser(null); // Opcional: actualizar usuario si es necesario
        setLoading(false); // Marcamos como cargado
      } catch (error: any) {
        console.error("Error al verificar token con /tasks:", error.response?.data || error.message); // Log de error
        localStorage.removeItem('token'); // Eliminamos el token inválido
        setIsAuthenticated(false); // Marcamos como no autenticado
        setUser(null); // Limpiamos el usuario
        setLoading(false); // Marcamos como cargado
      }
    }

    checkLoginStatus(); // Llamamos a la función al montar el componente
  }, []);

  // Renderizado del proveedor 
  return (
    <AuthContext.Provider value={{
      signup, // Función para registrar
      signin, // Función para iniciar sesión
      logout, // Función para cerrar sesión
      user, // Usuario autenticado
      isAuthenticated, // Estado de autenticación
      errors, // Lista de errores
      loading // Estado de carga
    }}>
      {loading ? ( // Si está cargando, mostramos un mensaje
        <p className="text-white text-center text-lg mt-10">Cargando aplicación...</p>
      ) : ( // Si no está cargando, renderizamos los hijos
        children
      )}
    </AuthContext.Provider>
  );
};