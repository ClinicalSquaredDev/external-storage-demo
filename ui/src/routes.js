import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import Files from "./scenes/Files";
import EnsureAuthenticated from "./components/EnsureAuthenticated";
import FileDetails from "./scenes/FileDetails";
import { ROUTES } from "./constants";

class Routes extends Component {
  render() {
    return (
      <EnsureAuthenticated>
        <Route exact path={ROUTES.FILES} component={Files} />
        <Route exact path={ROUTES.FILE_META} component={FileDetails} />
        <Route exact path={ROUTES.BASE}> <Redirect exact to={ROUTES.FILES} /> </Route>
      </EnsureAuthenticated>
    );
  }
}

export default Routes;
