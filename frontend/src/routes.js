import { HomePage } from "./pages/HomePage.jsx";
import { Boards } from "./pages/Boards.jsx";
import { TrelloApp } from "./pages/TrelloApp.jsx";
import { LoginSignup } from "./pages/LoginSignup.jsx";

export const routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: `/board/:boardId/:listId?/:taskId?`,
    component: TrelloApp,
  },
  {
    path: "/board",
    component: Boards,
  },
  {
    path: "/login",
    component: LoginSignup,
  },
];
