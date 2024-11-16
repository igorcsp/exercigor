import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const RegisterForm = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    setUserData(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Nome</label>
      <input
        className="form-input"
        {...register("name", {
          required: "O nome é obrigatório",
          maxLength: 45,
        })}
      />
      {errors.name && (
        <span style={{ color: "red" }}>{errors.name.message}</span>
      )}
      <hr />

      <label>E-mail</label>
      <input
        className="form-input"
        type="email"
        {...register("email", {
          required: "O e-mail é obrigatório",
          maxLength: 45,
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "E-mail inválido",
          },
        })}
      />
      {errors.email && (
        <span style={{ color: "red" }}>{errors.email.message}</span>
      )}
      <hr />

      <label>Senha</label>
      <input
        className="form-input"
        type="password"
        {...register("password", {
          required: "A senha é obrigatória",
          minLength: {
            value: 6,
            message: "A senha deve ter pelo menos 6 caracteres",
          },
          maxLength: 45,
        })}
      />
      {errors.password && (
        <span style={{ color: "red" }}>{errors.password.message}</span>
      )}
      <hr />

      <button className="login-btn form-submit" type="submit">
        Finalizar Cadastro
      </button>
    </form>
  );
};

export default RegisterForm;
