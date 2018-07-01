import express from "express";
import React from "react";
import ReactDOM from "react-dom/server";
import Helmet from "react-helmet";
import App from "../shared/App/App.jsx";
const app = express();
import { StaticRouter as Router, matchPath } from "react-router";
import routeBank from "../shared/routes/routes";

app.use("/dist", express.static("./dist"));

app.get("*", async (req, res) => {
  try {
    // match request url to our React Router paths and grab component
    let foundPath = null;
    let { component } =
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
    const response = await component.fetchData();
    const preloadedData = response ? response.data : {};
    // get store state (js object of entire store)
    const context = { data: preloadedData };
    const html = ReactDOM.renderToString(
      <Router context={context} location={req.url}>
        <App />
      </Router>
    );
    // render helmet data aka meta data in <head></head>
    const helmetData = Helmet.renderStatic();
    // send down page with initial state and meta data
    res.send(renderFullPage(html, preloadedData, helmetData));
  } catch (error) {
    res.status(400).send(renderFullPage("An error occured.", {}, {}));
  }
});

const port = process.env.PORT || 9000;
app.listen(port, function() {
  console.log("App running on http://localhost:" + port);
});

function renderFullPage(html, preloadedData, helmet) {
  return `
    <!doctype html>
    <html>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(preloadedData)}
        </script>
        <script src="/dist/assets/app.bundle.js"></script>
      </body>
    </html>
    `;
}
