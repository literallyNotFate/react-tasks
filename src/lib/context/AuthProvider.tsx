import { axiosApi } from "../../api/axios";
import { IAuth, IUser } from "../../models/types";
import { createContext, useState } from "react";

interface IAuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<IAuth>({
  user: null,
  setUser: () => {},
  getProfile: async () => {},
  logout: () => {},
  loadingProfile: false,
});

const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loadingProfile, setloadingProfile] = useState<boolean>(true);

  const getProfile = async () => {
    try {
      const response = await axiosApi.get<IUser>("/user/profile");
      setUser(response.data);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setloadingProfile(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, getProfile, logout, loadingProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
