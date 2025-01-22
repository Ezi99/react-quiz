import Option from "./Option";

function Options({ options }) {
  return (
    <div className="options">
      {options.map((option) => (
        <Option option={option} key={option} />
      ))}
    </div>
  );
}

export default Options;
