import "../index.css";
import removeBtn from "/removeButton.svg";

const RemoveButton = (props) => {
  return (
    <div className="add-button">
      <img width={props.widthAndHeight} src={removeBtn} alt="" />
    </div>
  );
};

export default RemoveButton;
