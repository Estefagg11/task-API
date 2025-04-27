import { Document, Schema } from 'mongoose';
import { Types } from 'mongoose'; 

// Define la interfaz para la estructura de datos de una tarea
// Estos son los tipos que el repositorio va a devolver (después de toTaskResponse)
// el frontend va a recibir este tipo de datos
export interface ITask {
  _id: string; 
  title: string;
  description?: string;
  completed: boolean;
  userId: string; 

  
  dueDate?: string; // Fecha de vencimiento de la tarea
  status?: string;  // Estado de la tarea 

  createdAt: string; // Fecha de creación de la tarea
  updatedAt: string; // Fecha de actualización de la tarea
}

// Interfaz para el documento Mongoose completo (lo que devuelve Mongoose antes de toTaskResponse)
// Esta interfaz es usada por el Repositorio y el Servicio (antes de la transformación)
// Debe coincidir con el Schema de Mongoose.
export interface TaskDocument extends Omit<ITask, '_id' | 'userId' | 'createdAt' | 'updatedAt' | 'dueDate'>, Document {
    _id: Types.ObjectId; 
    userId: Types.ObjectId; 
    createdAt: Date;
    updatedAt: Date; 
    dueDate?: Date; 
   
}


