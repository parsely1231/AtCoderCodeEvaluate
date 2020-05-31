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
import { ContestTable } from "./pages/TablePage/ContestTable"
import { RankingTable } from "./components/Ranking"
import { sampleData } from "./pages/RankingPage/aggregate"
import { StatusBarChart } from "./components/BarChart"
import { UserPage } from "./pages/UserPage/UserPage"
import { InputBox } from "./components/InputBox"

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
      <NavigationBar/>
      <div className="container">
        <div className="top-menu">
          <InputBox/>
          <PageLinks/>
        </div>
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

          <Route path="/user">
            <UserPage/>
          </Route>

          <Route exact path="/ranking/exectime">
            <RankingTable title={'Total'} ranking={sampleData} />
            <StatusBarChart/>
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