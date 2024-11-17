import React, { useEffect } from "react";
import { useTimer } from "react-timer-hook";
import playIcon from "/playBtn.svg";
import pauseIcon from "/pauseBtn.svg";

const Timer = ({ expiryTimestamp, autoStart, shouldStart, onExpire }) => {
  const sound = new Audio("/play.wav");

  const { seconds, minutes, isRunning, start, pause, restart } = useTimer({
    expiryTimestamp,
    autoStart,
    onExpire: () => {
      sound.play();
      onExpire();
    },
  });

  useEffect(() => {
    if (shouldStart) {
      start();
    }
  }, [shouldStart, start]);

  const handlePause = () => {
    pause();
  };

  const handleStart = () => {
    if (!isRunning) {
      restart(expiryTimestamp);
    }
  };

  return (
    <div className="timer-container">
      <div className="timer-display">
        <span>{String(minutes).padStart(2, "0")}</span>:
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>

      {isRunning ? (
        <button
          type="button"
          className="startPause"
          onClick={handlePause}
          aria-label="Pause timer"
        >
          <img src={pauseIcon} alt="" />
        </button>
      ) : (
        <button
          type="button"
          className="startPause"
          onClick={handleStart}
          aria-label="Start timer"
        >
          <img src={playIcon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Timer;
