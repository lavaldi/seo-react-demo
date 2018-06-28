import Home from "../app/home.jsx";
import User from "../app/user.jsx";

export default {
  routes: [
    {
      path: "/",
      component: Home,
      exact: true
    },
    {
      path: "/user",
      component: User,
      exact: true
    }
  ]
};
