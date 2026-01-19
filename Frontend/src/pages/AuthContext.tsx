import { createContext, useContext, useEffect, useState } from "react";



type Role = "operator" | "manager" | "project_manager";

interface User {
  id: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    const id = localStorage.getItem("userId");

    if (token && email && role && id) {
      setUser({
        id,
        email,
        role: role as Role,
      });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
