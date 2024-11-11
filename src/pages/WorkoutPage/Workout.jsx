import AddButton from "../../components/AddButton";
import trashIcon from "/trashIcon.svg";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Modal from "../../components/Modal";
import React, { useState } from "react";
import Exercise from "./Exercise";
import EditExercisesForm from "./EditExercisesForm";

const Workout = ({
  workoutName,
  id,
  workoutNumber,
  exercises,
  onWorkoutDataUpdate,
  onWorkoutUpdate,
  onWorkoutDelete,
  onExerciseDelete,
  user,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditSubmit = (updatedWorkout) => {
    onWorkoutUpdate(id, updatedWorkout);
    setShowEditModal(false);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
  };

  const deleteWorkout = async (workoutId) => {
    if (!workoutId) {
      console.error("ID do workout não fornecido");
      return;
    }
    try {
      const userWorkoutsRef = doc(db, "users", user.uid, "workouts", workoutId);
      await deleteDoc(userWorkoutsRef);
      console.log("Workout excluído com sucesso!");
      onWorkoutDelete(workoutId);
    } catch (error) {
      console.error("Erro ao excluir workout:", error);
    } finally {
      onWorkoutDataUpdate();
    }
  };

  return (
    <div className="workout-container">
      <div className="workout-header">
        <h2>
          Dia {workoutNumber}: {workoutName.toUpperCase()}
        </h2>
        <div className="workout-new-exercise">
          <span>adicionar novo exercício</span>
          <button className="add-button" onClick={handleEditClick}>
            <AddButton widthAndHeight="40" />
          </button>
          |
          <button
            className="delete-workout-btn"
            onClick={() => deleteWorkout(id)}
          >
            <img src={trashIcon} alt="" />
          </button>
        </div>
      </div>
      <div className="workout-exercises">
        {exercises.map((exercise, index) => (
          <Exercise
            key={index}
            {...exercise}
            onDelete={() => onExerciseDelete(id, index)}
            onEdit={handleEditClick}
          />
        ))}
      </div>
      <Modal show={showEditModal} handleModal={() => setShowEditModal(false)}>
        <EditExercisesForm
          workout={{ workoutName, exercises }}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      </Modal>
    </div>
  );
};

export default Workout;
