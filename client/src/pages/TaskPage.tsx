import { Link } from 'react-router-dom'; // Importamos Link para navegación entre rutas
import { useTasks } from '../context/TaskContext'; // Importamos el contexto de tareas


function TaskPage() {
    // Obtenemos las tareas, el estado de carga, errores y funciones del contexto
    const { tasks, loading, error, deleteTask, completeTask } = useTasks();

    // Función para manejar la eliminación de una tarea
    const handleDelete = async (id: string) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) { // Confirmación antes de eliminar
            return;
        }
        try {
            await deleteTask(id); // Llamamos a la función deleteTask del contexto
            console.log(`Tarea ${id} eliminada a través de la UI.`);
        } catch (err) {
            console.error(`Error al eliminar tarea ${id} desde UI:`, err); // mensaje de error
        }
    };

    // Función para manejar la acción de completar una tarea
    const handleComplete = async (id: string, currentCompletedStatus: boolean | undefined) => {
        if (currentCompletedStatus) { // Si la tarea ya está completada, no hacemos nada
            console.log("La tarea ya está completada.");
            return;
        }
        try {
            await completeTask(id); // Llamamos a la función completeTask del contexto
            console.log(`Tarea ${id} marcada como completada a través de la UI.`);
        } catch (err) {
            console.error(`Error al completar tarea ${id} desde UI:`, err); // mensaje de error
        }
    };

    // Renderizado condicional si las tareas están cargando
    if (loading) {
        return <p className="text-white text-center mt-10">Cargando tareas...</p>;
    }

    // Renderizado condicional si hay un error al cargar las tareas
    if (error) {
        return <p className="text-red-500 text-center mt-10">{error}</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-zinc-900 min-h-screen text-white">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Mis Tareas</h1>
                <div>
                    <Link
                        to="/add-task"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mr-4 transition-colors"
                    >
                        Añadir Tarea
                    </Link>
                </div>
            </header>

            {tasks.length === 0 ? ( // Si no hay tareas, mostramos un mensaje
                <p className="text-center text-gray-400">No tienes tareas todavía. ¡Añade una!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => ( // Iteramos sobre las tareas para renderizarlas
                        <div
                            key={task._id}
                            className={`p-6 rounded-lg shadow-md ${task.completed ? 'bg-zinc-700 opacity-60' : 'bg-zinc-800'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className={`text-xl font-semibold mb-2 ${task.completed ? 'line-through' : ''}`}>
                                        {task.title}
                                    </h2>
                                    <p className={`text-gray-300 ${task.completed ? 'line-through' : ''}`}>
                                        {task.description}
                                    </p>
                                </div>
                                {!task.completed && ( // Botón para completar la tarea si no está completada
                                    <button
                                        onClick={() => handleComplete(task._id, task.completed)}
                                        title="Marcar como completada"
                                        className="ml-4 p-1 flex-shrink-0 text-green-500 hover:text-green-400"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                            />
                                        </svg>
                                    </button>
                                )}
                                {task.completed && ( // Icono para indicar que la tarea está completada
                                    <span title="Completada" className="ml-4 p-1 flex-shrink-0 text-green-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06l-3.25 3.25-1.5-1.5a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.25-4.25Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                )}
                            </div>

                            {task.dueDate && ( // Mostrar la fecha de vencimiento 
                                <p className={`text-sm text-gray-400 mb-2 ${task.completed ? 'line-through' : ''}`}>
                                    Vencimiento: {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                            )}
                            {task.status && ( // Mostrar el estado de la tarea 
                                <p className={`text-sm text-gray-400 mb-4 ${task.completed ? 'line-through' : ''}`}>
                                    Estado: {task.status}
                                </p>
                            )}

                            <div className="mt-4 flex justify-end space-x-2">
                                <Link
                                    to={`/tasks/${task._id}`}
                                    className={`text-sm bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition-colors ${
                                        task.completed ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    onClick={(e) => {
                                        if (task.completed) e.preventDefault(); // Evitamos editar tareas completadas
                                    }}
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => handleDelete(task._id)} // Llamamos a handleDelete para eliminar la tarea
                                    className="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded transition-colors"
                                >
                                    Borrar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TaskPage; // Exportamos el componente para usarlo en otras partes de la aplicación