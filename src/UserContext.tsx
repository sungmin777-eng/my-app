// src/UserContext.tsx
import React, { createContext, useContext, useState } from "react";

interface User {
  id: number;
  name: string;
}

interface UserContextType {
  users: User[];
  addUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "성민" },
    { id: 2, name: "철수" },
  ]);

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  return (
    <UserContext.Provider value={{ users, addUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("UserContext must be used within a UserProvider");
  return context;
};
