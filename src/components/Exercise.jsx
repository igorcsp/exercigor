import React, { useState, useEffect } from "react";
import Timer from "./Timer";
import trashIcon from "/trashIcon.svg";
import editIcon from "/editIcon.svg";

const Exercise = ({
  exerciseName,
  series,
  repetitions,
  restTime,
  onDelete,
  onEdit
}) => {
  const [completedSeries, setCompletedSeries] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [shouldStartTimer, setShouldStartTimer] = useState(false);

  const time = new Date();
  time.setSeconds(time.getSeconds() + Number(restTime));

  const seriesArray = Array.from(
    { length: Number(series) },
    (_, index) => index
  );

  const deleteExercise = async () => {
    await onDelete();
  };

  const handleCheckboxChange = (index) => {
    if (index === completedSeries) {
      setCompletedSeries(index + 1);
      setShouldStartTimer(true);
    }
  };

  const handleTimerExpire = () => {
    setShouldStartTimer(false);
    setTimerKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    if (completedSeries === Number(series)) {
      setShouldStartTimer(false);
    }
  }, [completedSeries, series]);

  return (
    <div className="exercise-container">
      <div className="exercise-section exercise-header">
        <h3>{exerciseName}</h3>
        <button className="icons-btn icons-edit-btn" onClick={onEdit}>
          <img className="icon edit-icon" src={editIcon} alt="" />
        </button>
      </div>
      <div className="exercise-section exercise-main">
        <div className="series-container">
          <span>Séries:</span>
          <div>
            {seriesArray.map((_, index) => (
              <input
                className="series-checkbox"
                key={index}
                type="checkbox"
                checked={index < completedSeries}
                onChange={() => handleCheckboxChange(index)}
                disabled={index !== completedSeries}
              />
            ))}
          </div>
        </div>
        <div className="rest-container">
          <div>descanso:</div>
          <Timer
            key={timerKey}
            expiryTimestamp={time}
            autoStart={false}
            shouldStart={shouldStartTimer}
            onExpire={handleTimerExpire}
          />
        </div>
      </div>
      <div className="exercise-section exercise-footer">
        <span className="exercise-repetitions">Repetições: {repetitions}</span>
        <button className="icons-btn icons-trash-btn" onClick={deleteExercise}>
          <img className="icon trash-icon" src={trashIcon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Exercise;
