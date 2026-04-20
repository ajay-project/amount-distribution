import { useState, useEffect } from "react";
import "../styles/LoadingPopup.css";

export default function LoadingPopup({ isVisible, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { label: "Validating", icon: "🔍" },
    { label: "Generating", icon: "🎲" },
    { label: "Assigning", icon: "💰" },
    { label: "Updating", icon: "📝" },
    { label: "Complete", icon: "✅" },
  ];

  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("modal-open");
      document.documentElement.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    const totalDuration = 5000;
    const stepCount = steps.length - 1;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      const stepIndex = Math.floor((newProgress / 100) * stepCount);
      setProgress(newProgress);
      setCurrentStep(Math.min(stepIndex, stepCount));

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setProgress(100);
        setCurrentStep(steps.length - 1);
      }
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setCurrentStep(steps.length - 1);
      setTimeout(() => {
        onComplete();
      }, 400);
    }, totalDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isVisible, steps.length, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="loading-popup-overlay">
      <div className="loading-popup-content">
        {/* Decorative ring */}
        <div className="loading-ring" aria-hidden="true"></div>

        {/* Header */}
        <div className="loading-header">
          <div className="loading-main-icon">⚡</div>
          <h2>Processing Assignment</h2>
          <p>Setting up your box distribution</p>
        </div>

        {/* Progress */}
        <div className="loading-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-pct">{Math.round(progress)}%</span>
        </div>

        {/* Steps */}
        <div className="loading-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`loading-step ${
                index < currentStep ? "done" : index === currentStep ? "active" : "pending"
              }`}
            >
              <div className="loading-step-icon">
                {index < currentStep ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>
              <div className="loading-step-label">{step.label}</div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="loading-dots" aria-hidden="true">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        <p className="loading-status">
          {currentStep === steps.length - 1
            ? "All done! Closing..."
            : `${steps[currentStep].label}...`}
        </p>
      </div>
    </div>
  );
}
