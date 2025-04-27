import { createContext, useContext, useState, useEffect } from 'react'; // Importamos hooks de React
import {
    getTasksRequest, // Función para obtener todas las tareas
    getTaskRequest, // Función para obtener una tarea específica
    deleteTaskRequest, // Función para eliminar una tarea
    createTaskRequest, // Función para crear una nueva tarea
    updateTaskRequest, // Función para actualizar una tarea
    completeTaskRequest, // Función para marcar una tarea como completada
} from '../api/tasks'; // Importamos las funciones y tipos desde la API de tareas
import { Task, CreateTaskData, UpdateTaskData } from '../types/task';
import { useAuth } from './AuthContext'; // Importamos el contexto de autenticación

// Define la interfaz del contexto de tareas
interface TaskContextType {
  tasks: Task[]; // Lista de tareas
  getTasks: () => Promise<void>; // Función para cargar todas las tareas
  createTask: (task: CreateTaskData) => Promise<Task>; // Función para crear una tarea
  deleteTask: (id: string) => Promise<void>; // Función para eliminar una tarea
  updateTask: (id: string, task: UpdateTaskData) => Promise<Task>; // Función para actualizar una tarea
  completeTask: (id: string) => Promise<Task>; // Función para marcar una tarea como completada
  getTask: (id: string) => Promise<Task>; // Función para obtener una tarea específica
  loading: boolean; // Estado de carga
  error: string | null; // Estado de error
}

// Crea el contexto con un valor inicial undefined
export const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Hook personalizado para consumir el contexto de tareas
export const useTasks = () => {
  const context = useContext(TaskContext); // Obtenemos el contexto
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider'); // Error si no se usa dentro de un TaskProvider
  }
  return context; // Retornamos el contexto
};

// Componente Provider para tareas
export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading: authLoading } = useAuth(); // Obtenemos el estado de autenticación y carga del contexto de autenticación

  const [tasks, setTasks] = useState<Task[]>([]); // Estado para almacenar la lista de tareas
  const [loading, setLoading] = useState(false); // Estado para indicar si se están cargando tareas
  const [error, setError] = useState<string | null>(null); // Estado para almacenar errores

  // Función para cargar todas las tareas
  const loadTasks = async () => {
    if (!isAuthenticated || authLoading) { // Si el usuario no está autenticado o la autenticación está cargando
      setTasks([]); // Limpiamos las tareas
      setLoading(false); // Detenemos el estado de carga
      setError(null); // Limpiamos errores
      return;
    }

    try {
      setLoading(true); // Activamos el estado de carga
      setError(null); // Limpiamos errores
      const tasksData = await getTasksRequest(); // Obtenemos las tareas desde la API
      setTasks(tasksData); // Guardamos las tareas en el estado
    } catch (err: any) {
      console.error("Failed to fetch tasks in TaskContext:", err); // Log de error
      setError("No se pudieron cargar las tareas."); // Establecemos un mensaje de error
      setTasks([]); // Limpiamos las tareas
    } finally {
      setLoading(false); // Desactivamos el estado de carga
    }
  };

  // Efecto para cargar tareas cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && !authLoading) { // Si el usuario está autenticado y la autenticación ya cargó
      loadTasks(); // Cargamos las tareas
    } else if (!isAuthenticated && !authLoading) { // Si el usuario no está autenticado
      setTasks([]); // Limpiamos las tareas
      setLoading(false); // Detenemos el estado de carga
      setError(null); // Limpiamos errores
    }
  }, [isAuthenticated, authLoading]); // Dependencias: isAuthenticated y authLoading

  // Función para crear una nueva tarea
  const createTask = async (task: CreateTaskData): Promise<Task> => {
    try {
      const newTask = await createTaskRequest(task); // Creamos la tarea en la API
      setTasks(prevTasks => [...prevTasks, newTask]); // Añadimos la nueva tarea al estado
      setError(null); // Limpiamos errores
      return newTask; // Retornamos la tarea creada
    } catch (err) {
      console.error("Error creating task in TaskContext:", err); // Log de error
      setError("No se pudo crear la tarea."); // Establecemos un mensaje de error
      throw err; // Relanzamos el error
    }
  };

  // Función para eliminar una tarea
  const deleteTask = async (id: string): Promise<void> => {
    try {
      await deleteTaskRequest(id); // Eliminamos la tarea en la API
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id)); // Removemos la tarea del estado
      setError(null); // Limpiamos errores
    } catch (err) {
      console.error(`Error deleting task ${id} in TaskContext:`, err); // Log de error
      setError("No se pudo eliminar la tarea."); // Establecemos un mensaje de error
      throw err; // Relanzamos el error
    }
  };

  // Función para actualizar una tarea
  const updateTask = async (id: string, task: UpdateTaskData): Promise<Task> => {
    try {
      const updatedTask = await updateTaskRequest(id, task); // Actualizamos la tarea en la API
      setTasks(prevTasks => prevTasks.map(t => t._id === updatedTask._id ? updatedTask : t)); // Actualizamos la tarea en el estado
      setError(null); // Limpiamos errores
      return updatedTask; // Retornamos la tarea actualizada
    } catch (err) {
      console.error(`Error updating task ${id} in TaskContext:`, err); // Log de error
      setError("No se pudo actualizar la tarea."); // Establecemos un mensaje de error
      throw err; // Relanzamos el error
    }
  };

  // Función para marcar una tarea como completada
  const completeTask = async (id: string): Promise<Task> => {
    try {
      const completedTask = await completeTaskRequest(id); // Marcamos la tarea como completada en la API
      setTasks(prevTasks => prevTasks.map(t => t._id === completedTask._id ? completedTask : t)); // Actualizamos la tarea en el estado
      setError(null); // Limpiamos errores
      return completedTask; // Retornamos la tarea completada
    } catch (err) {
      console.error(`Error completing task ${id} in TaskContext:`, err); // Log de error
      setError("No se pudo completar la tarea."); // Establecemos un mensaje de error
      throw err; // Relanzamos el error
    }
  };

  // Función para obtener una tarea específica
  const getTask = async (id: string): Promise<Task> => {
    try {
      return await getTaskRequest(id); // Obtenemos la tarea desde la API
    } catch (err) {
      console.error(`Error fetching single task ${id} in TaskContext:`, err); // Log de error
      throw err; // Relanzamos el error
    }
  };

  // Valor que el provider proporcionará al contexto
  const contextValue = {
    tasks,
    getTasks: loadTasks,
    createTask,
    deleteTask,
    updateTask,
    completeTask,
    getTask,
    loading,
    error,
  };

  // Renderizamos el proveedor del contexto
  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};