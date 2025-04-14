import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface User {
    name: string;
    email: string;
    password: string;
}


function LoginPage() {

    const { register, handleSubmit, formState: {errors}} = useForm<User>(); 
    
    const {signin, errors: signinErrors} = useAuth(); 

    const onSubmit = handleSubmit(async (data) => {
        signin(data);
    });



    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900">
          <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md shadow-md">
            
            {
              signinErrors.map((error, i) => (
                <div className="bg-red-500 p-2 text-white rounded-md my-2" key={i}>
                  {error}
                </div>
              ))
            }
            
            <form onSubmit={onSubmit} className="flex flex-col space-y-4 w-full max-w-sm">
              <h1 className="text-2xl font-bold text-white">Login</h1>
    
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                placeholder="Email"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">Email is required</span>
              )}
    
              <input
                type="password"
                {...register("password", { required: true })}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red-500 text-sm">Password is required</span>
              )}
    
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
            </form>

            <p className="text-white mt-4 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-400 hover:underline">
                Register
              </Link>
            </p>

          </div>
        </div>
      );
    }
    
    export default LoginPage