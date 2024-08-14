import { useForm, useFieldArray } from "react-hook-form";
import AddButton from "./AddButton";
import RemoveButton from "./RemoveButton";

const EditExercisesForm = ({ workout, onSubmit, onCancel }) => {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({
    defaultValues: {
      workoutName: workout.workoutName,
      exercises: workout.exercises,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <label>Treino de...</label>
      <input
        className="form-input"
        {...register("workoutName", { required: true, maxLength: 45 })}
      />
      {errors.exercises && (
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
              maxLength: 45,
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
              Tenta crashar agr, fdp. É no máximo 10
            </span>
          )}
          <br />
          <label>Repetições</label>
          <input
            className="form-input"
            {...register(`exercises.${index}.repetitions`, {
              required: true,
            })}
            type="number"
          />
          {errors.exercises && (
            <span style={{ color: "red" }}>Este campo é obrigatório</span>
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
            <span style={{ color: "red" }}>Este campo é obrigatório</span>
          )}

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

      <button className="form-submit" type="submit">
        Salvar Alterações
      </button>
      <button className="form-submit" type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
};

export default EditExercisesForm;
