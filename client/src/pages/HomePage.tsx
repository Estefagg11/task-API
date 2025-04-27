import React, { useEffect, useState } from 'react'; // Importamos React y hooks
import { Link } from 'react-router-dom'; // Importamos Link para navegación
import { useAuth } from '../context/AuthContext'; // Importamos el contexto de autenticación
import { getTasksRequest } from '../api/tasks'; // Importamos la función para obtener tareas
import { Task } from '../types/task'; // Importamos la interfaz Task desde el archivo centralizado

const HomePage: React.FC = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth(); // Obtenemos el estado de autenticación y el usuario

  const [tasks, setTasks] = useState<Task[]>([]); // Estado para almacenar las tareas pendientes
  const [tasksLoading, setTasksLoading] = useState(false); // Estado para indicar si las tareas están cargando
  const [tasksError, setTasksError] = useState<string | null>(null); // Estado para almacenar errores al cargar tareas

  const username = user?.name || user?.email || 'Usuario'; // Obtenemos el nombre del usuario o un valor predeterminado

  // Efecto para cargar tareas pendientes si el usuario está autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated) { // Solo cargamos tareas si la autenticación ya terminó y el usuario está autenticado
      const fetchTasks = async () => {
        try {
          setTasksLoading(true); // Activamos el estado de carga de tareas
          setTasksError(null); // Limpiamos errores previos
          const tasksData = await getTasksRequest(); // Obtenemos las tareas desde la API
          const pendingTasks = tasksData.filter(task => !task.completed); // Filtramos las tareas pendientes
          setTasks(pendingTasks); // Guardamos las tareas pendientes en el estado
        } catch (err) {
          console.error("Error fetching tasks for count:", err); // mensaje de error
          setTasksError("No se pudieron cargar tus tareas pendientes."); // Establecemos un mensaje de error
        } finally {
          setTasksLoading(false); // Desactivamos el estado de carga de tareas
        }
      };
      fetchTasks(); // Llamamos a la función para cargar tareas
    } else if (!authLoading && !isAuthenticated) { // Si el usuario no está autenticado
      setTasks([]); // Limpiamos las tareas
      setTasksLoading(false); // Desactivamos el estado de carga de tareas
      setTasksError(null); // Limpiamos errores
    }
  }, [isAuthenticated, authLoading]); // Dependencias: se ejecuta cuando cambia el estado de autenticación

  // Mostrar un mensaje de carga si la autenticación o las tareas están cargando
  if (authLoading || tasksLoading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {authLoading ? 'Cargando aplicación...' : 'Cargando tareas...'}
        </p>
      </div>
    );
  }

  // Contenido principal de la página
  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center min-h-screen p-4">
      {isAuthenticated ? ( // Si el usuario está autenticado
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            ¡Bienvenido de vuelta, {username}!
          </h1>

          {tasksError ? ( // Si hubo un error al cargar tareas
            <p className="text-red-500 mb-4">{tasksError}</p>
          ) : (
            // Mostrar el número de tareas pendientes
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Tienes <span className="font-semibold text-indigo-600 dark:text-indigo-400">{tasks.length}</span> tarea{tasks.length !== 1 ? 's' : ''} pendiente{tasks.length !== 1 ? 's' : ''}. ¿Listo para organizar tu día?
            </p>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/tasks"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-200 ease-in-out shadow"
            >
              Ver mis Tareas
            </Link>
          </div>
        </div>
      ) : ( // Si el usuario no está autenticado
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Bienvenido a tu Gestor de Tareas
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Inicia sesión para gestionar tus tareas o regístrate si aún no tienes cuenta.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-200 ease-in-out shadow"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-200 ease-in-out shadow"
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage; // Exportamos el componente para usarlo en otras partes de la aplicación