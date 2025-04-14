
import mongoose, { Schema, Document } from 'mongoose';//importamos Schema y Document , librerías de mongoose
import { ITask } from '../types/task';//interfaz ITask 

// Definimos una interfaz llamada 'TaskDocument' que extiende dos cosas:
//'Omit<ITask, '_id'>': Esto significa que estamos tomando la interfaz 'ITask' y "omitimos" (es decir, excluimos) la propiedad '_id'. Esto se hace porque MongoDB agrega automáticamente un campo '_id' a los documentos, y no necesitamos incluirlo explícitamente aquí.
//'Document': Esto es una interfaz de Mongoose que incluye métodos y propiedades adicionales para interactuar con el documento en la base de datos (como los métodos `.save()` y `.remove()`).

export interface TaskDocument extends Omit<ITask, '_id'>, Document {
}
// Aquí estamos creando un esquema para la "Task" (Tarea) utilizando Mongoose.
// El 'TaskSchema' define cómo se estructura un documento de tarea en la base de datos y el tipo de datos que se espera.
const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },//titulo de la tarea tipo string y es obligatorio
    description: { type: String},//descripcion de la tarea tipo string
    completed: { type: Boolean, default: false },//indica si la tarea esta completada o no, es de tipo booleano y por defecto es false.
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }// id del usuario que creo la tarea, es de tipo ObjectId y es obligatorio
  },
  { timestamps: true }//timestamps: true agrega automáticamente dos campos a los documentos: createdAt y updatedAt. Estos campos se utilizan para almacenar la fecha y hora en que se creó y actualizó un documento.
);

//instrucción de Mongoose que crea un modelo basado en un esquema y lo asocia con una colección en la base de datos MongoDB.
export default mongoose.model<TaskDocument>('Task', TaskSchema);//exportamos el modelo de Mongoose para "Task", pasando el 'TaskDocument' como tipo de documento y el 'TaskSchema' como definición del esquema.