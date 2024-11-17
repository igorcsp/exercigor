import { useEffect, useState } from "react";
import Pagination from "./components/Pagination";
import AddButton from "./components/AddButton";
import Modal from "./components/Modal";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import WorkoutForm from "./pages/WorkoutPage/WorkoutForm.jsx";
import Workout from "./pages/WorkoutPage/Workout.jsx";
import CircularIndeterminate from "./components/CircularIndeterminate.jsx";
import Login from "./pages/Login/Login.jsx";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user) {
          const userWorkoutsRef = collection(db, "users", user.uid, "workouts");
          const querySnapshot = await getDocs(userWorkoutsRef);
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
          });
          items.sort((a, b) => a.createdAt - b.createdAt);
          setData(items);
        }
      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, refreshData]);

  useEffect(() => {
    if (data.length > 0 && currentPage >= data.length) {
      setCurrentPage(data.length - 1);
    }
  }, [data, currentPage]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setData([]);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleModal = () => {
    setShowModal((prev) => !prev);
  };

  const handleDataRefresh = () => {
    setRefreshData((prev) => !prev);
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleWorkoutDelete = async (deletedWorkoutId) => {
    const workoutRef = doc(db, "users", user.uid, "workouts", deletedWorkoutId);
    await deleteDoc(workoutRef);

    setData((prevData) => {
      const newData = prevData.filter(
        (workout) => workout.id !== deletedWorkoutId
      );
      if (currentPage >= newData.length) {
        setCurrentPage(Math.max(0, newData.length - 1));
      }
      return newData;
    });
    handleDataRefresh();
  };

  const handleExerciseDelete = async (workoutId, exerciseIndex) => {
    try {
      const workoutRef = doc(db, "users", user.uid, "workouts", workoutId);
      const workoutToUpdate = data.find((workout) => workout.id === workoutId);
      const updatedExercises = workoutToUpdate.exercises.filter(
        (_, index) => index !== exerciseIndex
      );
      await updateDoc(workoutRef, { exercises: updatedExercises });

      setData((prevData) => {
        const newData = prevData.map((workout) =>
          workout.id === workoutId
            ? { ...workout, exercises: updatedExercises }
            : workout
        );

        if (updatedExercises.length === 0 && currentPage < newData.length - 1) {
          setCurrentPage((prev) => prev + 1);
        } else if (
          updatedExercises.length === 0 &&
          currentPage === newData.length - 1
        ) {
          setCurrentPage((prev) => Math.max(0, prev - 1));
        }
        handleDataRefresh();

        return newData;
      });

      console.log("Exercício excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir exercício:", error);
    }
  };

  const handleWorkoutUpdate = async (workoutId, updatedWorkout) => {
    try {
      const workoutRef = doc(db, "users", user.uid, "workouts", workoutId);
      await updateDoc(workoutRef, updatedWorkout);

      setData((prevData) =>
        prevData.map((workout) =>
          workout.id === workoutId ? { ...workout, ...updatedWorkout } : workout
        )
      );
      console.log("Workout atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar workout:", error);
    }
  };

  if (loading) {
    return <CircularIndeterminate />;
  }

  if (!user) {
    return (
      <Login
        handleDataRefresh={handleDataRefresh}
        onLogin={() => setUser(auth.currentUser)}
      />
    );
  }

  const currentWorkout = data[currentPage];

  return (
    <div className="app">
      <header className="container-fluid py-3">
        <div className="row align-items-center">
          <div className="col-12 col-md-4 order-md-1 d-md-flex justify-content-md-start"></div>
          <div className="col-6 col-md-4 order-md-2 text-start text-md-center">
            <h1 className="mb-0">FitTrack</h1>
          </div>
          <div className="col-6 col-md-4 order-md-3 d-flex justify-content-end">
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </header>
      <section className="add-workout">
        <button className="add-button" onClick={handleModal}>
          <AddButton widthAndHeight="40" />
        </button>
        <p>adicionar treino</p>
      </section>
      <Modal show={showModal} handleModal={handleModal}>
        <WorkoutForm onWorkoutDataUpdate={handleDataRefresh} />
      </Modal>

      {data.length >= 2 && (
        <Pagination
          pageCount={Math.ceil(data.length / 1)}
          onPageChange={handlePageChange}
          forcePage={currentPage}
        />
      )}

      {currentWorkout && currentWorkout.exercises && (
        <Workout
          key={currentWorkout.id}
          id={currentWorkout.id}
          workoutNumber={currentPage + 1}
          workoutName={currentWorkout.workoutName}
          exercises={currentWorkout.exercises}
          onWorkoutDataUpdate={handleDataRefresh}
          onWorkoutDelete={handleWorkoutDelete}
          onExerciseDelete={handleExerciseDelete}
          onWorkoutUpdate={handleWorkoutUpdate}
          user={user}
        />
      )}
    </div>
  );
}

export default App;
