import { CircularProgress } from "@mui/material";
import React from "react";
import s from "./style.module.css";

export const CircularWrapper = () => {
  return (
    <div className={s.wrapper}>
      <CircularProgress />
    </div>
  );
};
