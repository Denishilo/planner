import { AppBar, Button, IconButton, LinearProgress, Toolbar, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import React from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "features/auth/auth.selectors";
import { selectStatus } from "app/app.selectors";
import { useActions } from "common/hooks";
import { authThunks } from "features/auth/auth.reducer";

export const Header = () => {
  const status = useSelector(selectStatus);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { logout } = useActions(authThunks);
  const logoutHandler = () => logout({});

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h6">News</Typography>
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
