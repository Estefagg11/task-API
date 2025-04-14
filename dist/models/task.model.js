"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose")); //importamos Schema y Document , librerías de mongoose
// Aquí estamos creando un esquema para la "Task" (Tarea) utilizando Mongoose.
// El 'TaskSchema' define cómo se estructura un documento de tarea en la base de datos y el tipo de datos que se espera.
const TaskSchema = new mongoose_1.Schema({
    title: { type: String, required: true }, //titulo de la tarea tipo string y es obligatorio
    description: { type: String }, //descripcion de la tarea tipo string
    completed: { type: Boolean, default: false }, //indica si la tarea esta completada o no, es de tipo booleano y por defecto es false.
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true } // id del usuario que creo la tarea, es de tipo ObjectId y es obligatorio
}, { timestamps: true } //timestamps: true agrega automáticamente dos campos a los documentos: createdAt y updatedAt. Estos campos se utilizan para almacenar la fecha y hora en que se creó y actualizó un documento.
);
//instrucción de Mongoose que crea un modelo basado en un esquema y lo asocia con una colección en la base de datos MongoDB.
exports.default = mongoose_1.default.model('Task', TaskSchema); //exportamos el modelo de Mongoose para "Task", pasando el 'TaskDocument' como tipo de documento y el 'TaskSchema' como definición del esquema.
