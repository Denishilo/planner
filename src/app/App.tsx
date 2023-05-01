import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsInitialized } from "app/app.selectors";
import { authThunks } from "features/auth/auth.reducer";
import { useActions } from "common/hooks";
import { ErrorSnackbar, Header } from "common/components";
import { Pages } from "app/Pages/Pages";
import { CircularWrapper } from "common/components/CircularWrapper/CircularWrapper";

export const App = () => {
  const isInitialized = useSelector(selectIsInitialized);
  const { initializeApp } = useActions(authThunks);

  useEffect(() => {
    initializeApp({});
  }, []);

  if (!isInitialized) {
    return <CircularWrapper />;
  }

  return (
    <>
      <Header />
      <Pages />
      <ErrorSnackbar />
    </>
  );
};
