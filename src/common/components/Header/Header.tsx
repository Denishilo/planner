import { AppBar, Button, LinearProgress, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "features/auth/auth.selectors";
import { selectStatus } from "app/app.selectors";
import { useActions } from "common/hooks";
import { authThunks } from "features/auth/auth.reducer";
import s from "./style.module.css";
import { Navigate } from "react-router-dom";

export const Header = () => {
  const status = useSelector(selectStatus);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { logout } = useActions(authThunks);
  const logoutHandler = () => logout({});

  if (isLoggedIn) {
    return <Navigate to={"/todolists"} />;
  }

  return (
    <AppBar position="static">
      <Toolbar className={s.toolWrapper}>
        <Typography variant="h6">Planner</Typography>
        {isLoggedIn && (
          <Button color="inherit" onClick={logoutHandler}>
            Log out
          </Button>
        )}
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  );
};
