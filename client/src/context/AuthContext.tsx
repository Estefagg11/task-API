import { createContext, useState, useContext, useEffect} from 'react';
import { registerRequest, loginRequest } from '../api/auth';



interface User {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  signup: (user: User) => Promise<void>;
  signin: (user: User) => Promise<void>;
  isAuthenticated: boolean;
  errors: string[]; // Cambiado a string | null 
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]); 


  const signup = async (user: User): Promise<void> => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
      setErrors([]); // limpiar error si todo sale bien
    } catch (error) {
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as any).response.data === "string"
        ) {
          setErrors([(error as any).response.data]); // Lo guardamos como un array
        } else {
          setErrors(["Unknown error occurred"]); // También como array
        }
      }
      
  };

  const signin = async (user: User): Promise<void> => {
    try {
      const res = await loginRequest(user);
      console.log(res.data);
      setIsAuthenticated(true);
      setUser(res.data);
      localStorage.setItem('token', res.data.token); // Guardar el token en el localStorage
      setErrors([]); // limpiar errores si todo salió bien
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response.data === "string"
      ) {
        setErrors([(error as any).response.data]);
      } else {
        setErrors(["Unknown error occurred"]);
      }
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]); // Limpiar errores después de 5 segundos
      }, 5000); // 5000 ms = 5 seconds
      return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta
    }
  }, [errors]); // Solo se ejecuta si hay errores

  
  return (
    <AuthContext.Provider value={{ signup, signin, user, isAuthenticated, errors }}>
      {children}
    </AuthContext.Provider>
  );
};
