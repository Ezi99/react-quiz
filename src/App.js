import Header from "./Header";
import Main from "./Main";
import { useEffect, useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";

const initialState = {
  questions: [],
  status: "loading",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    default:
      throw new Error("Action unkown");
  }
}

export default function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);

  useEffect(function () {
    async function getQuestions() {
      try {
        const res = await fetch("http://localhost:8000/questions");

        if (!res.ok) {
          throw new Error(
            `something went wrong when getting questions, Status: ${res.status}, Message: ${res.statusText}`
          );
        }

        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (error) {
        console.log(error.message());
        dispatch({ type: "dataFailed" });
      }
    }
    getQuestions();
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numOfQuestions={questions.length} />
        )}
      </Main>
    </div>
  );
}
