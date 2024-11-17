import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Timer from "../components/Timer";
import { useTimer } from "react-timer-hook";

// Mock para react-timer-hook
jest.mock("react-timer-hook", () => ({
  useTimer: jest.fn(),
}));

// Mock para o Audio
window.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn(),
}));

// Mock para as imagens
jest.mock("/playBtn.svg", () => "play-icon");
jest.mock("/pauseBtn.svg", () => "pause-icon");

describe("Timer Component", () => {
  const mockStart = jest.fn();
  const mockPause = jest.fn();
  const mockRestart = jest.fn();
  const mockOnExpire = jest.fn();
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 30); // 30 segundos de timer

  beforeEach(() => {
    jest.clearAllMocks();
    // Configuração padrão do mock do useTimer
    useTimer.mockReturnValue({
      seconds: 30,
      minutes: 0,
      isRunning: false,
      start: mockStart,
      pause: mockPause,
      restart: mockRestart,
    });
  });

  it("renders correctly with initial time", () => {
    useTimer.mockReturnValue({
      seconds: 30,
      minutes: 0,
      isRunning: false,
      start: mockStart,
      pause: mockPause,
      restart: mockRestart,
    });

    render(
      <Timer
        expiryTimestamp={expiryTimestamp}
        autoStart={false}
        shouldStart={false}
        onExpire={mockOnExpire}
      />
    );

    // Verifica se o tempo está formatado corretamente (00:30)
    expect(screen.getByText("00")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("starts timer when shouldStart prop changes to true", () => {
    const { rerender } = render(
      <Timer
        expiryTimestamp={expiryTimestamp}
        autoStart={false}
        shouldStart={false}
        onExpire={mockOnExpire}
      />
    );

    // Simula a mudança da prop shouldStart
    rerender(
      <Timer
        expiryTimestamp={expiryTimestamp}
        autoStart={false}
        shouldStart={true}
        onExpire={mockOnExpire}
      />
    );

    expect(mockStart).toHaveBeenCalled();
  });

  it("shows pause button when timer is running", () => {
    useTimer.mockReturnValue({
      seconds: 30,
      minutes: 0,
      isRunning: true,
      start: mockStart,
      pause: mockPause,
      restart: mockRestart,
    });

    render(
      <Timer
        expiryTimestamp={expiryTimestamp}
        autoStart={false}
        shouldStart={true}
        onExpire={mockOnExpire}
      />
    );

    const pauseButton = screen.getByRole("button");
    expect(pauseButton).toBeInTheDocument();
    expect(pauseButton.getAttribute("aria-label")).toBe("Pause timer");

    fireEvent.click(pauseButton);
    expect(mockPause).toHaveBeenCalled();
  });

  it("shows play button when timer is not running", () => {
    render(
      <Timer
        expiryTimestamp={expiryTimestamp}
        autoStart={false}
        shouldStart={false}
        onExpire={mockOnExpire}
      />
    );

    const playButton = screen.getByRole("button");
    expect(playButton).toBeInTheDocument();
    expect(playButton.getAttribute("aria-label")).toBe("Start timer");

    fireEvent.click(playButton);
    expect(mockRestart).toHaveBeenCalledWith(expiryTimestamp);
  });

  it("calls onExpire and plays sound when timer expires", () => {
    const mockAudioPlay = jest.fn();
    window.Audio.mockImplementation(() => ({
      play: mockAudioPlay,
    }));

    // Simula a expiração do timer chamando diretamente o onExpire
    useTimer.mockImplementation(({ onExpire }) => {
      // Chama o onExpire para simular a expiração do timer
      onExpire();

      return {
        seconds: 0,
        minutes: 0,
        isRunning: false,
        start: mockStart,
        pause: mockPause,
        restart: mockRestart,
      };
    });

    render(
      <Timer
        expiryTimestamp={expiryTimestamp}
        autoStart={false}
        shouldStart={false}
        onExpire={mockOnExpire}
      />
    );

    // Verifica se tanto o onExpire quanto o play do áudio foram chamados
    expect(mockOnExpire).toHaveBeenCalled();
    expect(mockAudioPlay).toHaveBeenCalled();
  });

  // Teste adicional para verificar a integração com o sistema de séries
  it("resets timer when key prop changes", () => {
    const { rerender } = render(
      <Timer
        key={1}
        expiryTimestamp={expiryTimestamp}
        autoStart={false}
        shouldStart={false}
        onExpire={mockOnExpire}
      />
    );

    // Simula a mudança da key após completar uma série
    rerender(
      <Timer
        key={2}
        expiryTimestamp={expiryTimestamp}
        autoStart={false}
        shouldStart={false}
        onExpire={mockOnExpire}
      />
    );

    // Verifica se o timer foi reiniciado com os valores iniciais
    expect(screen.getByText("00")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
  });
});
