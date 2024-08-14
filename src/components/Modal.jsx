import delBtn from "/deleteIcon.svg";

const Modal = ({ show, handleModal, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <button className="delete-icon" onClick={handleModal}>
          <img src={delBtn} alt="" />
        </button>
        {children}
      </section>
    </div>
  );
};

export default Modal;
