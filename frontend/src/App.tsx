import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from "react-router-dom";

import { ContestTable } from "./pages/TablePage/ContestTable"


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
      <div className="container">
        <Link to="/table">Table</Link>
        <Link to="/">Home</Link>
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
            <ContestTable />
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