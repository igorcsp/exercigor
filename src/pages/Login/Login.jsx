import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig.js";
import Modal from "../../components/Modal";
import RegisterForm from "./RegisterForm";

function Login({ onLogin, handleDataRefresh }) {
  const [error, setError] = useState(null);
  const [registerFormModal, setRegisterFormModal] = useState(false);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegisterFormModal = () => {
    setRegisterFormModal((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      const { email, password } = data; // Desestrutura os dados do formulário
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">E-mail</label>
        <br />
        <input
          className="form-input"
          type="email"
          id="email"
          {...register("email", { required: "Campo obrigatório" })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
        <br />
        <label htmlFor="password">Senha</label>
        <br />
        <input
          className="form-input"
          type="password"
          id="password"
          {...register("password", { required: "Campo obrigatório" })}
        />
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
        <br />

        {error && (
          <p className="error">
            Error: <em>{error}</em>
          </p>
        )}

        <button className="login-btn form-submit" type="submit">
          Entrar
        </button>
        <button
          className="login-btn form-submit"
          type="button"
          onClick={handleRegisterFormModal}
          style={{ background: "none", border: "1px solid black" }}
        >
          Cadastrar
        </button>
      </form>
      <Modal show={registerFormModal} handleModal={handleRegisterFormModal}>
        <h2 className="workout-header">Cadastro</h2>
        <RegisterForm />
      </Modal>
    </div>
  );
}

export default Login;
