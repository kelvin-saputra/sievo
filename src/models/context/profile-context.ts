import { createContext } from "react";
import { UserSchema } from "../schemas";
import { UpdateUserProfileDTO } from "../dto/user.dto";


interface ProfileContextType {
    user: UserSchema | null;
    loading: boolean;

    fetchProfile: () => Promise<void>;
    handleUpdateProfile: (data: UpdateUserProfileDTO) => Promise<void>;
}
const ProfileContext = createContext<ProfileContextType | null>(null);

export default ProfileContext;