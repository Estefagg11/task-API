import axiosInstance from './axiosInstance'; // Importamos la instancia configurada
import { Task, CreateTaskData, UpdateTaskData } from '../types/task'; // Importamos las interfaces y tipos desde types/task

//Función para obtener todas las tareas del usuario autenticado
export const getTasksRequest = async (): Promise<Task[]> => { //Exportamos la función
  try { // Hacemos la petición GET a /tasks usando nuestra instancia de Axios
    const response = await axiosInstance.get<Task[]>('/tasks'); // Especificamos que esperamos un array de Task
    return response.data; // Devuelve el array de tareas
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error; // Relanzamos el error para que el componente lo maneje
  }
};

//Función para obtener una tarea específica por su ID
export const getTaskRequest = async (id: string): Promise<Task> => { //Exportamos la función
  try { //Hacemos la petición GET a /tasks/:id usando nuestra instancia de Axios
    const response = await axiosInstance.get<Task>(`/tasks/${id}`); // solicitud al backend para obtener la tarea y sus detalles 
    return response.data; // Devuelve la tarea encontrada
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error); //Manejo de errores
    throw error;
  }
};

//Función para crear una nueva tarea
export const createTaskRequest = async (task: CreateTaskData): Promise<Task> => { //Exportamos la función
  try {// Petición POST a /tasks con los datos de la nueva tarea (CreateTaskData)
       // El backend genera el _id, completed, timestamps y user.
    const response = await axiosInstance.post<Task>('/tasks', task); // solicitud al backend para crear la tarea
    return response.data; // Devuelve la tarea recién creada (con su _id y demas campos generados por el backend)
  } catch (error) {
    console.error("Error creating task:", error);// Manejo de errores
    throw error;
  }
};

//Función para atualizar una tarea existente
export const updateTaskRequest = async (id: string, task: UpdateTaskData): Promise<Task> => { //Exportamos la función
  try {
    // Petición PUT a /tasks/:id con los datos a actualizar (UpdateTaskData)
    // El backend espera el ID en la URL y los datos a actualizar en el cuerpo de la petición.
    const response = await axiosInstance.put<Task>(`/tasks/${id}`, task); //solicutud para actualizar la tarea
    return response.data; // El backend devuelve la tarea actualizada
  } catch (error) {
    console.error(`Error updating task ${id}:`, error); // Manejo de errores
    throw error;
  }
};

//Función para marcar una tarea como completada 
export const completeTaskRequest = async (id: string): Promise<Task> => { //Exportamos la función
  try { // Petición a /tasks/:id/complete (o a /tasks/:id con { completed: true } usando PUT)
    const response = await axiosInstance.patch<Task>(`/tasks/${id}/complete`); // Envía una petición al backend para cambiar el valor de completed a true
    return response.data; // Devuelve la tarea actualizada (con completed: true)
  } catch (error) {
    console.error(`Error completing task ${id}:`, error); // Manejo de errores
    throw error;
  }
};

// Función para BORRAR una tarea
export const deleteTaskRequest = async (id: string): Promise<void> => { //Exportamos la función
  try {// Petición DELETE a /tasks/:id
      // Esperamos una respuesta 204 No Content, por eso el Promise<void>
    await axiosInstance.delete(`/tasks/${id}`); //solicitud al backend para eliminar la tarea
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error); // Manejo de errores
    throw error;
  }
};