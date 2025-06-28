// src/UserList.tsx
import React from "react";
import { useUserContext } from "./UserContext";

export const UserList: React.FC = () => {
  const { users } = useUserContext();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.id}. {user.name}
        </li>
      ))}
    </ul>
  );
};
