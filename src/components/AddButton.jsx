import "../index.css";
import addBtn from "/addIcon.svg";

const AddButton = (props) => {
  return (
    <div className="add-button">
      <img width={props.widthAndHeight} src={addBtn} alt="" />
    </div>
  );
};

export default AddButton;
