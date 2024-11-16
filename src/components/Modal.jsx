import delBtn from "/deleteIcon.svg";

const Modal = ({ show, handleModal, children }) => {
  if (!show) return null; // Não renderiza nada se o modal não estiver visível

  return (
    <div className="modal-overlay">
      <section className="modal-main">
        <button className="delete-icon" onClick={handleModal}>
          <img src={delBtn} alt="fechar" />
        </button>
        {children}
      </section>
    </div>
  );
};

export default Modal;
