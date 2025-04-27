import mongoose, { Schema } from 'mongoose'; // Solo importar Schema, Document si TaskDocument ya no se define aquí
import { TaskDocument } from '../types/task'; // Importar TaskDocument desde types/task


// Definimos el esquema para la colección 'tasks'
const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true }, //asegurar que el título sea requerido
    description: { type: String }, //asegurar que la descripción sea opcional
    completed: { type: Boolean, default: false }, //asegurar que el valor por defecto sea false
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, //asegurar que el userId sea requerido y referencie a la colección 'User'

    dueDate: { type: Date, required: false }, 
    status: { type: String, required: false, default: 'pendiente' } 

  },
  { timestamps: true } // Agregar timestamps para createdAt y updatedAt automáticamente
);

// Crea y exporta el modelo de Mongoose para 'Task', tipado con TaskDocument importado
export default mongoose.model<TaskDocument>('Task', TaskSchema);