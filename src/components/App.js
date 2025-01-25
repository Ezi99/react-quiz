import Header from "./Header";
import Main from "./Main";
import { useEffect, useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECONDS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  remainingSeconds: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        remainingSeconds: state.questions.length * SECONDS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        highscore: Math.max(state.highscore, state.points),
        status: "finished",
      };
    case "restart":
      return {
        ...initialState,
        status: "ready",
        highscore: state.highscore,
        questions: state.questions,
      };
    case "tick":
      return {
        ...state,
        remainingSeconds: state.remainingSeconds - 1,
        status: state.remainingSeconds === 0 ? "finished" : state.status,
        highscore: Math.max(state.highscore, state.points),
      };
    default:
      throw new Error("Action unkown");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, remainingSeconds },
    dispatch,
  ] = useReducer(reducer, initialState);

  const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0);

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
          <StartScreen numOfQuestions={questions.length} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numOfQuestions={questions.length}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer remainingSeconds={remainingSeconds} dispatch={dispatch} />
              {answer !== null && (
                <NextButton
                  dispatch={dispatch}
                  index={index}
                  numOfQuestions={questions.length}
                />
              )}
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
