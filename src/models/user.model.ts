
import mongoose, { Schema, Document } from 'mongoose';//importamos Schema y Document 
import bcrypt from 'bcrypt';//importa la librería bcrypt, que se utiliza para hashear (encriptar) y comparar contraseñas de forma segura
import { IUser } from '../types/user';//importamos la interfaz de usuario


export interface UserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(password: string): Promise<boolean>;//comparar la contraseña de un usuario con la proporcionada.
}

const UserSchema: Schema = new Schema(//Creamos el esquema de Mongoose para el modelo de usuario.
  {
    name: { type: String, required: true },//El nombre del usuario, es de tipo String y es obligatorio.
    email: { type: String, required: true, unique: true },//El email del usuario, es de tipo String, es obligatorio y debe ser único. 
    password: { type: String, required: true }//La contraseña del usuario, es de tipo String y es obligatoria.
  },
  { timestamps: true }//timestamps: true agrega createdAt y updatedAt campos al esquema.
);

UserSchema.pre<UserDocument>('save', async function(next) {//pre middleware se ejecuta antes de guardar un documento.
  if (!this.isModified('password')) return next();//Si la contraseña no ha sido modificada, se llama a la función next() para continuar con el siguiente middleware.
  //Este chequeo es crucial para evitar que una contraseña ya hasheada sea hasheada nuevamente cada vez que se actualice el documento del usuario. 
  //Si no se realiza esta verificación, el hash de la contraseña cambiaría innecesariamente, lo que haría que las contraseñas almacenadas no coincidan con las originales.


  try {
    const salt = await bcrypt.genSalt(10);//Genera un salt con 10 rondas. si 2 usuarios tienen la misma contraseña sus contraseñas hasheadas sean diferentes.
    this.password = await bcrypt.hash(this.password, salt);//Hashea la contraseña del usuario.
    next();//Llama a la función next() para continuar con el siguiente middleware.
  } catch (error: any) {//Si hay un error, se maneja con el siguiente middleware.
    next(error);//Llama a la función next() con el error.
  }
});


UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {//compara la contraseña de un usuario con la proporcionada.
  return bcrypt.compare(password, this.password); //realiza el proceso de comparación de manera segura, verificando si la contraseña en texto plano, al ser hasheada, coincide con el hash almacenado.
};

export default mongoose.model<UserDocument>('User', UserSchema);//exportamos el modelo de Mongoose para "User", pasando el 'UserDocument' como tipo de documento y el 'UserSchema' como definición del esquema.