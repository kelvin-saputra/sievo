import { createContext } from "react";
import { UserSchema } from "../schemas";
import { DeleteUserDTO, GenerateTokenDTO } from "../dto/user.dto";


interface UserContextType {
    users: UserSchema[];
    loading: boolean;

    fetchAllUsers: () => Promise<void>;
    handleDeleteUser: (data: DeleteUserDTO) => Promise<void>;
    handleGenerateToken: (data: GenerateTokenDTO) => Promise<string>;
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;