import { authReducer, authThunks } from "features/auth/auth.reducer";

let startState = {
  isLoggedIn: false,
};

test("correct logout flow", () => {
  startState = {
    isLoggedIn: true,
  };
  const action = authThunks.logout.fulfilled({ isLoggedIn: false }, "requestId");
  const endState = authReducer(startState, action);
  expect(endState.isLoggedIn).toBe(false);
});

test("correct login flow", () => {
  startState = {
    isLoggedIn: false,
  };
  const action = authThunks.login.fulfilled({ isLoggedIn: true }, "requestId", {
    email: "test@mail.ru",
    password: "testtest",
    rememberMe: false,
  });
  const endState = authReducer(startState, action);
  expect(endState.isLoggedIn).toBe(true);
});
