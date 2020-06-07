import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from "react-router-dom";

import { NavigationBar } from "./components/NavigationBar"
import { PageLinks } from "./components/PageLinks"
import { ContestTablePage } from "./pages/TablePage/index"
import { StatusBarChart } from "./components/BarChart"
import { UserPage } from "./pages/UserPage/UserPage"
import { RankingPage } from "./pages/RankingPage/index"

interface IdProps {
  id: string
}

const IdPage: React.FC<IdProps> = (props) => {
  return (
    <div>
      <p>ID PAGE</p>
      <p>id = {props.id}</p>
    </div>
  )
}

console.log('APP page')


const App = () => {
  return (
    <Router>
      <div className="header-container">
        <NavigationBar/>
      </div>

      <div className="container">
        <Switch>
          <Route
            exact
            path="/"
            component={() => (
              <div>AtCoder XXXXXXXXX
                <p>root page</p>
              </div>
            )}
          />
          <Route path="/table">
            <ContestTablePage
              userId={'parsely'}
              language="Python3 (3.4.3)"
            />
          </Route>

          <Route path="/user">
            <UserPage/>
          </Route>

          <Route exact path="/ranking/exectime">
            <RankingPage
              userId={"parsely"}
              language="Python3 (3.4.3)"
            />
          </Route>

          <Route
            path="/abc/:id"
            render={({ match }) => {
              const id:string = match.params.id
              return (
                <IdPage id={id} />
              );
            }}
          />
          <Redirect path="/arc" to="/" />
        </Switch>
      </div>
    </Router>
  );
};

export default App;