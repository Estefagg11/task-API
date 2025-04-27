import { useForm } from "react-hook-form"; // Importamos useForm para manejar formularios
import { useAuth } from "../context/AuthContext"; // Importamos el contexto de autenticación
import { Link, useNavigate } from "react-router-dom"; // Importamos Link para navegación y useNavigate para redirecciones
import { User } from '../types/user'; // Importamos la interfaz User desde types/user.ts

function LoginPage() {
    // Configuración del formulario con react-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm<User>(); 
    
    // Obtenemos las funciones y estados del contexto de autenticación
    const { signin, errors: signinErrors } = useAuth();
    
    const navigate = useNavigate(); // Hook para navegar programáticamente

    // Función que se ejecuta al enviar el formulario
    const onSubmit = handleSubmit(async (data) => {
      try {
        await signin(data); // Llamamos a la función signin del contexto con los datos del formulario
        console.log("Login successful, redirecting...");
        navigate("/tasks"); // Redirigimos a la página de tareas después de iniciar sesión
      } catch (error) {
        console.error("Login Error:", error); // mensaje de error si ocurre un problema
      }
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900">
          <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md shadow-md">
            
            {/* Mostramos los errores de inicio de sesión si existen */}
            {
              signinErrors.map((error, i) => (
                <div className="bg-red-500 p-2 text-white rounded-md my-2" key={i}>
                  {error}
                </div>
              ))
            }
            
            {/* Formulario de inicio de sesión */}
            <form onSubmit={onSubmit} className="flex flex-col space-y-4 w-full max-w-sm">
              <h1 className="text-2xl font-bold text-white">Login</h1>
    
              {/* Campo de email */}
              <input
                type="email"
                {...register("email", { required: true })} // Registramos el campo con validación requerida
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                placeholder="Email"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">Email es requerido</span> // Mensaje de error si el email no se proporciona
              )}
    
              {/* Campo de contraseña */}
              <input
                type="password"
                {...register("password", { required: true })} // Registramos el campo con validación requerida
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">contraseña requerida</span> // Mensaje de error si la contraseña no se proporciona
              )}
    
              {/* Botón de envío */}
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
            </form>

            {/* Enlace para registrarse si no tiene cuenta */}
            <p className="text-white mt-4 text-center">
              Aun no tienes una cuenta?{" "}
              <Link to="/register" className="text-indigo-400 hover:underline">
                Register
              </Link>
            </p>

          </div>
        </div>
    );
}

export default LoginPage; // Exportamos el componente para usarlo en otras partes de la aplicación