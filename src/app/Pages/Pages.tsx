import { Route, Routes } from "react-router-dom";
import { TodolistsList } from "features/todolists-list/TodolistsList";
import { Login } from "features/auth/Login";
import { Container } from "@mui/material";
import React from "react";

export const Pages = () => {
  return (
    <Container fixed>
      <Routes>
        <Route path={"/"} element={<TodolistsList />} />
        <Route path={"/login"} element={<Login />} />
      </Routes>
    </Container>
  );
};
