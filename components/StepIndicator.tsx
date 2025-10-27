import React from 'react';
import { Step } from '../types';

interface StepIndicatorProps {
  currentStep: Step;
}

const steps: { id: Step; name: string; icon: string }[] = [
  { id: 'audience', name: 'Hedef Kitle', icon: 'fa-users' },
  { id: 'offer', name: 'Teklif', icon: 'fa-gift' },
  { id: 'copy', name: 'Reklam Metni', icon: 'fa-pen-to-square' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = currentStepIndex >= index;
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'bg-brand-cyan text-brand-dark' : 'bg-brand-light-dark text-brand-text-light'
                  }`}
                >
                  <i className={`fas ${step.icon} text-xl`}></i>
                </div>
                <p className={`mt-2 text-xs text-center ${isActive ? 'text-brand-text' : 'text-brand-text-light'}`}>{step.name}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 transition-all duration-300 ${isActive && currentStepIndex > index ? 'bg-brand-cyan' : 'bg-brand-light-dark'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
