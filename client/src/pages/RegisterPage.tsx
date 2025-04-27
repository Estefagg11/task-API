import { useForm } from 'react-hook-form'; // provee funciones para manejar formularios, (validacion, valores, errores). importamos la funcion que hace la peticion al backend para registrar un usuario
import {useAuth} from '../context/AuthContext'; // importamos el contexto de autenticacion para poder usarlo en el componente
import { useEffect } from 'react'; // importamos el hook useState para manejar el estado del usuario
import { useNavigate } from 'react-router-dom';

function RegisterPage(){// componente de registro
    interface User { // definimos la interfaz/estructura de usuario, react-hook-form la usa para saber que campos manejar y que tipo de datos
        name: string;
        email: string;
        password: string;
    }

    const { register, handleSubmit, formState: {errors} } = useForm<User>();// registrar cada input del formulario y se encarga de manejar el submit del formulario, se pasa la interfaz User para que sepa que tipo de datos manejar
    const {signup, isAuthenticated, errors: registerErrors} = useAuth(); // usamos el hook useAuth para obtener la funcion de registro y el estado de usuario del contexto de autenticacion
    const navigate = useNavigate(); // usamos el hook useNavigate para redirigir al usuario a la pagina de inicio si ya esta autenticado

    useEffect(() => { // usamos el hook useEffect para redirigir al usuario a la pagina de inicio si ya esta autenticado
        if (isAuthenticated) navigate ('/tasks'); // si el usuario ya esta autenticado lo redirigimos a la pagina de inicio
    },   [isAuthenticated]);
    

    const onSubmit = handleSubmit(async (values) => {
        signup(values);
    }); // manejamos el submit del formulario, le pasamos la funcion de registro y los valores del formulario, al hacer submit se ejecuta la funcion de registro y se le pasan los valores del formulario
    

    return (
        <div className="flex justify-center items-center min-h-screen bg-zinc-900">
          <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md shadow-md">
            {
              registerErrors.map((error, i) => (
                <div className="bg-red-500 p-2 text-white rounded-md my-2" key={i}>
                  {error}
                </div>
              ))
            }
            <form onSubmit={onSubmit} className="flex flex-col space-y-4">
              <input
                type="text"
                {...register("name", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                placeholder="Username"
              />
              {errors.name && <span className="text-red-500">Nombre es requerido</span>}
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                placeholder="Email"
              />
              {errors.email && <span className="text-red-500">Email es requerido</span>}
              <input
                type="password"
                {...register("password", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                placeholder="Password"
              />
              {errors.password && <span className="text-red-500">Contraseña es requerida</span>}
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Register
              </button>
            </form>

            <p className="text-center text-white mt-4">
              ya tienes una cuenta? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
            </p>

          </div>
        </div>
    );      
}

export default RegisterPage // exportamos el componente para poder usarlo en otras partes de la aplicacion

