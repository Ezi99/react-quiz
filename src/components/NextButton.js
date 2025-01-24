function NextButton({ dispatch, index, numOfQuestions }) {
  let dispatchType;
  let buttonText;

  console.log(index);

  if (index === numOfQuestions - 1) {
    dispatchType = "finish";
    buttonText = "Finish";
  } else {
    dispatchType = "nextQuestion";
    buttonText = "Next";
  }

  return (
    <button
      className="btn btn-ui"
      onClick={() => dispatch({ type: dispatchType })}
    >
      {buttonText}
    </button>
  );
}

export default NextButton;
