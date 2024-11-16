import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Modal from "../../components/Modal";
import RegisterForm from "./RegisterForm";

function Login({ onLogin, handleDataRefresh }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleModal = () => {
    setShowModal((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleDataRefresh();
      onLogin();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login - FitTrack</h2>
      <form onSubmit={handleSubmit}>
        <label>E-mail</label>
        <br />
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label>Senha</label>
        <br />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button className="login-btn form-submit" type="submit">
          Entrar
        </button>
        <button
          className="login-btn form-submit"
          onClick={handleModal}
          style={{ background: "none", border: "1px solid black" }}
        >
          Cadastrar
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <Modal show={showModal} handleModal={handleModal}>
        <RegisterForm />
      </Modal>
    </div>
  );
}

export default Login;
