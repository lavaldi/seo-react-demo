import React, { Component } from "react";
import { Helmet } from "react-helmet";

class Home extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Home</title>
        </Helmet>
        <strong>Home</strong>
      </div>
    );
  }
}
export default Home;
