import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { useLocalStorage } from "./utils/useLocalStrage"

import { NavigationBar } from "./components/NavigationBar"
import { ContestTablePage } from "./pages/TablePage/index"
import { UserPage } from "./pages/UserPage/index"
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
  const [userId, setUserId] = useLocalStorage("userName", "")
  const [language, setLanguage] = useLocalStorage("language", "C++14 (GCC 5.4.1)")

  return (
    <Router>
      <div className="header-container">
        <NavigationBar
          userName={userId}
          language={language}
          setUserName={setUserId}
          setLanguage={setLanguage}
        />
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
              userId={userId}
              language={language}
            />
          </Route>

          <Route path="/user">
            <UserPage
              userId={userId}
              language={language}
              />
          </Route>

          <Route exact path="/ranking">
            <RankingPage
              userId={userId}
              language={language}
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