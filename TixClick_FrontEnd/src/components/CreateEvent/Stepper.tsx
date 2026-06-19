import React from "react";

interface StepperProps {
  currentStep: number;
  steps: string[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto mb-8">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div
            key={index}
            className="flex-1 flex flex-col items-center relative"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2
                ${isCompleted ? "bg-green-500 border-green-500 text-white" : ""}
                ${isActive ? "border-blue-500 text-blue-500" : ""}
                ${
                  !isCompleted && !isActive
                    ? "border-gray-300 text-gray-400"
                    : ""
                }
              `}
            >
              {isCompleted ? "✓" : index + 1}
            </div>
            <span
              className={`text-sm mt-2 text-center ${
                isActive ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
            >
              {step}
            </span>
            {index !== steps.length - 1 && (
              <div
                className={`absolute top-4 left-full h-0.5 w-full ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
