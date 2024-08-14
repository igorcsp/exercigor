import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import AddButton from "./AddButton";
import RemoveButton from "./RemoveButton";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const WorkoutForm = ({ onWorkoutDataUpdate }) => {
  const [workouts, setWorkouts] = useState([]);
  const [enableButton, setEnableButton] = useState(false);

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      workoutName: "",
      exercises: [
        { exerciseName: "", series: "", repetitions: "", restTime: "" },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const onSubmit = async (data) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("Nenhum usuário autenticado");
      return;
    }

    const newWorkout = {
      workoutName: data.workoutName,
      exercises: data.exercises,
      createdAt: serverTimestamp(),
    };

    setEnableButton(true);

    try {
      const userWorkoutsRef = collection(db, "users", user.uid, "workouts");
      const docRef = await addDoc(userWorkoutsRef, newWorkout);
      console.log("Documento adicionado com ID: ", docRef.id);
      setWorkouts([...workouts, { ...newWorkout, firestoreId: docRef.id }]);
      reset();
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    } finally {
      onWorkoutDataUpdate();
      setEnableButton(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Treino de...</label>
      <input
        className="form-input"
        {...register("workoutName", { required: true, maxLength: 45 })}
      />
      {errors.workoutName && (
        <span style={{ color: "red" }}>Este campo é obrigatório</span>
      )}
      <hr />

      {fields.map((field, index) => (
        <div key={field.id}>
          <label>Nome do exercício</label>
          <input
            className="form-input"
            {...register(`exercises.${index}.exerciseName`, {
              required: true,
              maxLength: 60,
            })}
          />
          {errors.exercises && (
            <span style={{ color: "red" }}>Este campo é obrigatório</span>
          )}
          <br />
          <label>Séries</label>
          <input
            className="form-input"
            {...register(`exercises.${index}.series`, {
              required: true,
              min: 1,
              max: 10,
            })}
            type="number"
          />
          {errors.exercises && (
            <span style={{ color: "red" }}>
              Este campo é obrigatório. Máx: 10
            </span>
          )}
          <br />
          <label>Repetições</label>
          <input
            className="form-input"
            {...register(`exercises.${index}.repetitions`, { required: true })}
            type="number"
          />
          {errors.exercises && (
            <span style={{ color: "red" }}>Este campo é obrigatório.</span>
          )}
          <br />
          <label>Tempo de descanso(s)</label>
          <input
            className="form-input"
            {...register(`exercises.${index}.restTime`, {
              required: true,
              min: 0,
              max: 300,
            })}
            type="number"
          />
          {errors.exercises && (
            <span style={{ color: "red" }}>
              Este campo é obrigatório. Máx: 300s
            </span>
          )}
          <br />
          <hr />
          {index > 0 && (
            <button
              className="form-submit-exercise remove"
              type="button"
              onClick={() => remove(index)}
            >
              <RemoveButton widthAndHeight={"30"} />
              <p>Remover Exercício</p>
            </button>
          )}
        </div>
      ))}

      <button
        className="form-submit-exercise add"
        type="button"
        onClick={() =>
          append({
            exerciseName: "",
            series: "",
            repetitions: "",
            restTime: "",
          })
        }
      >
        <AddButton widthAndHeight={"30"} />
        <p>Adicionar mais exercícios</p>
      </button>

      <button className="form-submit" type="submit" disabled={enableButton}>
        Enviar
      </button>
    </form>
  );
};

export default WorkoutForm;
