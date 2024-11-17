import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Workout from "../pages/WorkoutPage/Workout";
import { deleteDoc, doc } from "../__mocks__/firebase/firestore";

// Mock the components and modules
jest.mock("../components/AddButton", () => {
  return function DummyAddButton({ widthAndHeight }) {
    return <div data-testid="add-button">Add Button</div>;
  };
});

jest.mock("../components/Modal", () => {
  return function DummyModal({ children, show, handleModal }) {
    if (!show) return null;
    return (
      <div data-testid="modal" onClick={handleModal}>
        {children}
      </div>
    );
  };
});

// Mock Exercise component
jest.mock("../pages/WorkoutPage/Exercise", () => {
  return function DummyExercise(props) {
    return <div data-testid="exercise">{props.name}</div>;
  };
});

// Mock EditExercisesForm component
jest.mock("../pages/WorkoutPage/EditExercisesForm", () => {
  return function DummyEditExercisesForm({ workout, onSubmit, onCancel }) {
    return (
      <div data-testid="edit-form">
        <button onClick={() => onSubmit({ ...workout })}>Submit</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  };
});

// Mock Firebase
jest.mock("firebase/firestore", () => ({
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("../firebaseConfig", () => ({
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}));

describe("Workout Component", () => {
  const mockProps = {
    workoutName: "Push Day",
    id: "123",
    workoutNumber: 1,
    exercises: [
      {
        name: "Bench Press",
        sets: 3,
        reps: 12,
        weight: 100,
      },
    ],
    onWorkoutDataUpdate: jest.fn(),
    onWorkoutUpdate: jest.fn(),
    onWorkoutDelete: jest.fn(),
    onExerciseDelete: jest.fn(),
    user: { uid: "user123" },
  };

  let consoleSpy;

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
  });

  it("renders workout information correctly", () => {
    render(<Workout {...mockProps} />);

    expect(
      screen.getByText(
        `Dia ${mockProps.workoutNumber}: ${mockProps.workoutName.toUpperCase()}`
      )
    ).toBeInTheDocument();
    expect(screen.getByText("adicionar novo exercício")).toBeInTheDocument();
  });

  it("opens edit modal when add button is clicked", () => {
    render(<Workout {...mockProps} />);

    const addButton = screen.getByTestId("add-button");
    fireEvent.click(addButton.parentElement);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("closes modal when cancel is clicked", () => {
    render(<Workout {...mockProps} />);

    // Open modal
    const addButton = screen.getByTestId("add-button");
    fireEvent.click(addButton.parentElement);

    // Find and click cancel button
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("deletes workout when delete button is clicked", async () => {
    doc.mockReturnValue("mockDocRef");
    deleteDoc.mockResolvedValue();

    render(<Workout {...mockProps} />);

    const deleteButton = screen.getByRole("button", { name: "" });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalled();
      expect(mockProps.onWorkoutDelete).toHaveBeenCalledWith(mockProps.id);
      expect(mockProps.onWorkoutDataUpdate).toHaveBeenCalled();
    });
  });

  it("handles workout update correctly", async () => {
    render(<Workout {...mockProps} />);

    // Open modal
    const addButton = screen.getByTestId("add-button");
    fireEvent.click(addButton.parentElement);

    // Find and click submit button
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    expect(mockProps.onWorkoutUpdate).toHaveBeenCalledWith(
      mockProps.id,
      expect.objectContaining({
        workoutName: mockProps.workoutName,
        exercises: mockProps.exercises,
      })
    );
  });

  it("handles error when deleting workout", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error");
    deleteDoc.mockRejectedValueOnce(new Error("Delete failed"));

    render(<Workout {...mockProps} />);

    const deleteButton = screen.getByRole("button", { name: "" });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao excluir workout:",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
