import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import routeOptions from "../routes/routes";

class App extends Component {
  render() {
    let routes = routeOptions.routes.map(({ path, component, exact }, i) => (
      <Route
        key={Math.random() + "ROUTE_"}
        exact={exact}
        path={path}
        component={component}
      />
    ));
    return (
      <div>
        <Navbar />
        <Switch>{routes}</Switch>
      </div>
    );
  }
}
export default App;
