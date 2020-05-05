import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from "react-router-dom";
import { ContestTable } from "./ContestTable"


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
          <Route
            exact
            path="/abc"
            component={() => (
              <div>ABC page</div>
            )}
          />
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
        <ContestTable/>
      </div>
    </Router>
  );
};

export default App;