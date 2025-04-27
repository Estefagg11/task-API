// src/pages/TaskFormPage.tsx

import { useEffect } from 'react'; // Importamos useEffect para manejar efectos secundarios
import { useForm } from 'react-hook-form'; // Importamos useForm para manejar formularios
import { useNavigate, useParams } from 'react-router-dom'; // Importamos hooks para navegación y parámetros de la URL
import { useTasks } from '../context/TaskContext'; // Importamos el contexto de tareas
import { Task, CreateTaskData, UpdateTaskData } from '../types/task'; // Importamos tipos y funciones relacionadas con tareas

// Interfaz para tipar los datos del formulario
interface TaskFormData {
  title: string; // Título de la tarea
  description: string; // Descripción de la tarea
  dueDate: string; // Fecha de vencimiento 
  status: string; // Estado de la tarea 
}

function TaskFormPage() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<TaskFormData>(); // Configuración del formulario
  const navigate = useNavigate(); // Hook para navegar programáticamente
  const params = useParams<{ id?: string }>(); // Obtenemos los parámetros de la URL (como el ID de la tarea)

  const { createTask, updateTask, getTask } = useTasks(); // Obtenemos funciones del contexto de tareas

  const isEditing = !!params.id; // Determinamos si estamos en modo edición (si hay un ID en los parámetros)

  // Efecto para cargar los datos de la tarea si estamos en modo edición
  useEffect(() => {
    const loadTask = async () => {
      if (isEditing && params.id) { // Si estamos editando y hay un ID
        try {
          const task: Task = await getTask(params.id); // Obtenemos la tarea desde el contexto
          setValue('title', task.title); // Llenamos el campo title del formulario
          setValue('description', task.description); // Llenamos el campo description
          if (task.dueDate) {
            const formattedDate = new Date(task.dueDate).toISOString().split('T')[0]; // Formateamos la fecha
            setValue('dueDate', formattedDate); // Llenamos el campo dueDate
          }
          if (task.status) {
            setValue('status', task.status); // Llenamos el campo status
          }
        } catch (error) {
          console.error("Error al cargar la tarea para editar:", error); //mensaje de error
          navigate('/tasks'); // Redirigimos a la lista de tareas si ocurre un error
        }
      }
    };
    loadTask(); // Llamamos a la función para cargar la tarea
  }, [isEditing, params.id, setValue, navigate, getTask]); // Dependencias del efecto

  // Función que se ejecuta al enviar el formulario
  const onSubmit = handleSubmit(async (data) => {
    const payload: CreateTaskData | UpdateTaskData = {
      ...data,
      dueDate: data.dueDate || undefined, // Aseguramos que dueDate sea undefined si no se proporciona
      status: data.status || undefined, // Aseguramos que status sea undefined si no se proporciona
    };

    try {
      if (isEditing && params.id) {
        await updateTask(params.id, payload as UpdateTaskData); // Actualizamos la tarea si estamos en modo edición
      } else {
        await createTask(payload as CreateTaskData); // Creamos una nueva tarea si no estamos en modo edición
      }
      navigate('/tasks'); // Redirigimos a la lista de tareas después de guardar
    } catch (error) {
      console.error("Error al guardar la tarea desde UI:", error); // mensaje de error
      alert('Error al guardar la tarea.'); // Mostramos un mensaje de error
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          {isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea'} {/* Título dinámico según el modo */}
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Campo para el título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Título</label>
            <input
              type="text"
              id="title"
              {...register("title", { required: "El título es obligatorio" })} // Validación requerida
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md border border-zinc-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              placeholder="Ej. Hacer la compra"
            />
            {errors.title && (<span className="text-red-500 text-xs mt-1">{errors.title.message}</span>)}
          </div>

          {/* Campo para la descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
            <textarea
              id="description"
              rows={3}
              {...register("description", { required: "La descripción es obligatoria" })} // Validación requerida
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md border border-zinc-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              placeholder="Ej. Comprar leche, huevos y pan"
            />
            {errors.description && (<span className="text-red-500 text-xs mt-1">{errors.description.message}</span>)}
          </div>

          {/* Campo para la fecha de vencimiento */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">Fecha de Vencimiento</label>
            <input
              type="date"
              id="dueDate"
              {...register("dueDate")}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md border border-zinc-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </div>

          {/* Campo para el estado */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
            <select
              id="status"
              {...register("status")}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md border border-zinc-600 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              defaultValue=""
            >
              <option value="" disabled>Selecciona un estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="bloqueada">Bloqueada</option>
              <option value="completada">Completada</option>
            </select>
          </div>

          {/* Botón para guardar */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-semibold"
          >
            {isEditing ? 'Actualizar Tarea' : 'Guardar Tarea'}
          </button>
        </form>

        {/* Botón para cancelar */}
        <button
          onClick={() => navigate('/tasks')}
          className="w-full mt-4 bg-zinc-600 text-white py-2 px-4 rounded-md hover:bg-zinc-700 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default TaskFormPage; // Exportamos el componente para usarlo en otras partes de la aplicación