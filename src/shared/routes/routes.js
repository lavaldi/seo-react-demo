import Home from "../App/Home.jsx";
import User from "../App/User.jsx";

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
