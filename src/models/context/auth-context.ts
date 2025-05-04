import { createContext } from "react";
import { LoginDTO, RegisterDTO } from "../dto";
import { UserSchema } from "../schemas";


interface AuthenticationContextType {  
    user: UserSchema | null;
    loading: boolean;

    handleLogin: (data: LoginDTO) => Promise<boolean>;
    handleRegister: (data: RegisterDTO) => Promise<void>;
    handleLogout: () => Promise<void>;
    handleAck: () => Promise<void>;
    handleCheckToken: (token: string) => Promise<boolean>
}
  
  const AuthenticationContext = createContext<AuthenticationContextType | null>(null);
  
  export default AuthenticationContext;