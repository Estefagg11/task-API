// Interfaz para representar una tarea
export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  status?: 'pendiente' | 'en progreso' | 'bloqueada' | 'completada' | string;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para los datos necesarios al crear una tarea
export type CreateTaskData = Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'completed'>;

// Tipo para los datos necesarios al actualizar una tarea
export type UpdateTaskData = Partial<Omit<Task, '_id' | 'createdAt' | 'updatedAt'>>;
