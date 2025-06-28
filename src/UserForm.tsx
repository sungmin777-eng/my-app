import React, { useState, useRef } from "react";
import { useUserContext } from "./UserContext";


export const UserForm: React.FC = () => {
  const { addUser } = useUserContext();
  const [name, setName] = useState("");
  const idRef = useRef<number>(3);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim() === "") return;

    const newUser = {
      id: idRef.current++,
      name,
    };

    addUser(newUser);
    setName("");
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <input
        type="text"
        value={name}
        onChange={onChangeHandler}
        placeholder="이름 입력"
      />
      <button type="submit">추가</button>
    </form>
  );
};

