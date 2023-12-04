import { IAuth } from "../../models/types";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export const useAuth = (): IAuth => useContext(AuthContext);
