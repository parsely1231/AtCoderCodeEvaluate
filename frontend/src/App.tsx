import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from "react-router-dom";


interface ContestProps {
  name: string;
  problems: string
}

const ContestClass = (name:string, problems:string):ContestProps => {
  return {
    name: name,
    problems: problems,
  }
}


const sampleContests = [
  ContestClass('ABC120', 'A'),
  ContestClass('ABC130', 'B'),
]

const ContestLine: React.FC<ContestProps> = props => {
  return (
    <li>{props.name}: {props.problems}</li>
  )
}

interface TableProps {
  contests: ContestProps[]
}

const ContestTable: React.FC<TableProps> = (props) => {
  const contests = props.contests;
  return (
  <div>
    <ul>
      {contests.map((contest:ContestProps) => {
        return(
          <ContestLine
            name={contest.name}
            problems={contest.problems}
            />
        )
      })}
    </ul>
  </div>
  );
};

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


const API_URL = process.env.TEST_API_URL;

const fetchContestsInfo = () => {
  fetch(`${API_URL}`)
    .then(res => {
      if (res.ok) {
        return res.json()
      } else {
        console.log(res);
        return;
      }
    })
    .catch(() => undefined)
};


const App = () => {
  return (
    <Router>
      <div>
        <Link to={"/abc"}>abc</Link>
        <Link to={"/abc/:20"}>abc20</Link>
        <Switch>
          <Route
            exact
            path="/"
            component={() => (
              <div>AtCoder Code Evaluate
                <p>root page</p>
                <ContestTable
                  contests={sampleContests}
                />
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
      </div>
    </Router>
  );
};

export default App;