"use strict";
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
exports.UserRepository = void 0;
const user_model_1 = __importDefault(require("../models/user.model")); //importa el modelo de usuario
class UserRepository {
    create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new user_model_1.default(userData); //crea un nuevo objeto de tipo User con los datos de userData
            return yield user.save(); //guarda el objeto en la base de datos
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findOne({ email }); //busca un usuario por email
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findById(id); //busca un usuario por id
        });
    }
    toUserResponse(user) {
        return {
            _id: user._id.toString(), //convierte el id a string
            name: user.name, //nombre del usuario
            email: user.email, //email del usuario
            createdAt: user.createdAt, //fecha de creacion del usuario
            updatedAt: user.updatedAt //fecha de actualizacion del usuario
        };
    }
}
exports.UserRepository = UserRepository;
