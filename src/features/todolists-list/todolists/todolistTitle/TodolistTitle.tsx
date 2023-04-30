import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import React, { FC } from "react";
import { useActions } from "common/hooks";
import { TodolistDomainType, todosThunks } from "features/todolists-list/todolists/todolists-reducer";

export const TodolistTitle: FC<Props> = ({ todolist }) => {
  const { removeTodo, changeTodolistTitle } = useActions(todosThunks);
  const removeTodolistCallback = () => {
    removeTodo(todolist.id);
  };
  const changeTodolistTitleCallback = (title: string) => {
    changeTodolistTitle({ id: todolist.id, title });
  };

  return (
    <h3>
      <EditableSpan value={todolist.title} onChange={changeTodolistTitleCallback} />
      <IconButton onClick={removeTodolistCallback} disabled={todolist.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  );
};

///////// types ////////
type Props = {
  todolist: TodolistDomainType;
};
