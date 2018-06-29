import express from "express";
import React from "react";
import ReactDOM from "react-dom/server";
import helmet from "react-helmet";
import App from "../shared/App/App.jsx";
const app = express();
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reducers from "../shared/App/redux/reducers/combine";
import { StaticRouter as Router, matchPath } from "react-router";
import thunk from "../shared/App/redux/middleware/thunk";
import routeBank from "../shared/routes/routes";

app.use("/dist", express.static("./dist"));

app.get("*", async (req, res) => {
  try {
    // create new redux store on each request
    const store = createStore(reducers, {}, applyMiddleware(thunk));
    let foundPath = null;
    // match request url to our React Router paths and grab component
    let { path, component } =
      routeBank.routes.find(({ path, exact }) => {
        foundPath = matchPath(req.url, {
          path,
          exact,
          strict: false
        });
        return foundPath;
      }) || {};
    // safety check for valid component, if no component we initialize an empty shell.
    if (!component) component = {};
    // safety check for fetchData function, if no function we give it an empty promise
    if (!component.fetchData)
      component.fetchData = () => new Promise(resolve => resolve());
    // meat and bones of our isomorphic application: grabbing async data
    await component.fetchData({
      store,
      params: foundPath ? foundPath.params : {}
    });
    // get store state (js object of entire store)
    let preloadedState = store.getState();
    const context = {};
    const html = ReactDOM.renderToString(
      <Provider store={store}>
        <Router context={context} location={req.url}>
          <App />
        </Router>
      </Provider>
    );
    // render helmet data aka meta data in <head></head>
    const helmetData = helmet.renderStatic();
    // send down page with initial state and meta data
    res.send(renderFullPage(html, preloadedState, helmetData));
  } catch (error) {
    res.status(400).send(renderFullPage("An error occured.", {}, {}));
  }
});

const port = process.env.PORT || 9000;
app.listen(port, function () {
  console.log("App running on http://localhost:" + port);
});

function renderFullPage(html, preloadedState, helmet) {
  return `
    <!doctype html>
    <html>
      <head>
        <link rel="icon" href="/dist/favicon.ico" type="image/ico" />
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
      /</g,
      "\\u003c"
    )}
        </script>
        <script src="/dist/assets/app.bundle.js"></script>
      </body>
    </html>
    `;
}
