import Task from '../models/task.model'; //importar el modelo de tarea
import { ITask, TaskDocument } from '../types/task'; // importar la interfaz de tarea
import { Types } from 'mongoose'; // importar Types de mongoose

export class TaskRepository { // Definición de la clase TaskRepository
  
  async create(taskData: Partial<ITask>): Promise<TaskDocument> { // Método para crear una tarea
    const task = new Task(taskData); // Crear una nueva instancia de Task con los datos proporcionados
    return await task.save(); // Guardar la tarea en la base de datos y devolver el documento guardado
  }

  async findById(id: string): Promise<TaskDocument | null> { // Método para encontrar una tarea por su ID
    return await Task.findById(id); // Buscar la tarea en la base de datos por su ID y devolver el documento encontrado
  }

  async findAll(userId: string | Types.ObjectId): Promise<TaskDocument[]> { // Método para encontrar todas las tareas de un usuario
    return await Task.find({ userId: userId }); // Buscar todas las tareas en la base de datos que coincidan con el userId proporcionado y devolver los documentos encontrados
  }

  async update(id: string, taskData: Partial<ITask>): Promise<TaskDocument | null> { // Método para actualizar una tarea por su ID
    return await Task.findByIdAndUpdate(id, taskData, { new: true, runValidators: true }); // Buscar la tarea en la base de datos por su ID, actualizarla con los datos proporcionados y devolver el documento actualizado
  }

  async delete(id: string): Promise<TaskDocument | null> { // Método para eliminar una tarea por su ID
    return await Task.findByIdAndDelete(id); // Buscar la tarea en la base de datos por su ID y eliminarla, devolviendo el documento eliminado
  }


  toTaskResponse(task: TaskDocument): ITask { // Método para convertir un documento de tarea a un objeto de respuesta
    return {
      _id: task._id.toString(), 
      title: task.title,  
      description: task.description, 
      completed: task.completed, 
      userId: task.userId.toString(), 
      createdAt: task.createdAt.toISOString(), 
      updatedAt: task.updatedAt.toISOString(),
      dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
      status: task.status,
    };
  }

  toTaskResponseList(tasks: TaskDocument[]): ITask[] { // Método para convertir una lista de documentos de tarea a una lista de objetos de respuesta
    return tasks.map(task => this.toTaskResponse(task)); // Mapear cada documento de tarea a un objeto de respuesta utilizando el método toTaskResponse
  }
}