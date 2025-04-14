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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose")); //importamos Schema y Document 
const bcrypt_1 = __importDefault(require("bcrypt")); //importa la librería bcrypt, que se utiliza para hashear (encriptar) y comparar contraseñas de forma segura
const UserSchema = new mongoose_1.Schema(//Creamos el esquema de Mongoose para el modelo de usuario.
{
    name: { type: String, required: true }, //El nombre del usuario, es de tipo String y es obligatorio.
    email: { type: String, required: true, unique: true }, //El email del usuario, es de tipo String, es obligatorio y debe ser único. 
    password: { type: String, required: true } //La contraseña del usuario, es de tipo String y es obligatoria.
}, { timestamps: true } //timestamps: true agrega createdAt y updatedAt campos al esquema.
);
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next(); //Si la contraseña no ha sido modificada, se llama a la función next() para continuar con el siguiente middleware.
        //Este chequeo es crucial para evitar que una contraseña ya hasheada sea hasheada nuevamente cada vez que se actualice el documento del usuario. 
        //Si no se realiza esta verificación, el hash de la contraseña cambiaría innecesariamente, lo que haría que las contraseñas almacenadas no coincidan con las originales.
        try {
            const salt = yield bcrypt_1.default.genSalt(10); //Genera un salt con 10 rondas. si 2 usuarios tienen la misma contraseña sus contraseñas hasheadas sean diferentes.
            this.password = yield bcrypt_1.default.hash(this.password, salt); //Hashea la contraseña del usuario.
            next(); //Llama a la función next() para continuar con el siguiente middleware.
        }
        catch (error) { //Si hay un error, se maneja con el siguiente middleware.
            next(error); //Llama a la función next() con el error.
        }
    });
});
UserSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.compare(password, this.password); //realiza el proceso de comparación de manera segura, verificando si la contraseña en texto plano, al ser hasheada, coincide con el hash almacenado.
    });
};
exports.default = mongoose_1.default.model('User', UserSchema); //exportamos el modelo de Mongoose para "User", pasando el 'UserDocument' como tipo de documento y el 'UserSchema' como definición del esquema.
