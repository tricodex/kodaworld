import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled = false }) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label className={`switch ${disabled ? 'switch--disabled' : ''}`}>
      <label htmlFor="switchInput">
        <label htmlFor="switchInput">Toggle Switch</label>
        <input
          id="switchInput"
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          disabled={disabled}
        />
      </label>
      <span className="slider"></span>
    </label>
  );
};

export default Switch;