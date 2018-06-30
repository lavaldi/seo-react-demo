import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { getUser } from "../Services/userService";

export default class User extends Component {
  static fetchData() {
    return getUser(1);
  }

  constructor (props) {
    super(props);

    let data;
    if (typeof window != "undefined" && window.__PRELOADED_STATE__) {
      data = window.__PRELOADED_STATE__;
      delete window.__PRELOADED_STATE__
    }

    this.state = data ? data : {};
  }

  componentDidMount() {
    if (!!!Object.keys(this.state).length) {
      getUser(1)
        .then((response) => {
          this.setState({
            name: response.data.name,
            email: response.data.email,
          })
        });
    }
  }

  render() {
    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>User</title>
        </Helmet>
        <strong>User page </strong>
        <p>Async data</p>
        <pre>
          [name: {this.state.name}, email: {this.state.email}]
        </pre>
      </div>
    );
  }
}
