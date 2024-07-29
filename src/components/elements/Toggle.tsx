'use client';
import React, { useState, useEffect } from 'react'

export default function Toggle() {
  const [config, setConfig] = useState({
    backgroundColor: '#2e394d',
    primaryColor: '#b197fc',
    secondaryColor: '#ffffff',
    toggleWidth: 60,
    toggleHeight: 34,
    togglePadding: 3,
    animationDuration: 0.3,
    borderRadius: 17,
    labelOn: 'ON',
    labelOff: 'OFF',
    showLabels: true,
    labelColor: '#ffffff'
  });

  const [isChecked, setIsChecked] = useState(false);
  const [cssCode, setCssCode] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [jsCode, setJsCode] = useState('');

  useEffect(() => {
    updateCodes();
  }, [config, isChecked]);

  function updateConfig(key: string, value: any) {
    setConfig(prev => ({ ...prev, [key]: value }));
  }

  function updateCodes() {
    // Update CSS code
    const css = `
.toggle {
  position: relative;
  display: inline-block;
  width: ${config.toggleWidth}px;
  height: ${config.toggleHeight}px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${config.secondaryColor};
  transition: ${config.animationDuration}s;
  border-radius: ${config.borderRadius}px;
}

.slider:before {
  position: absolute;
  content: "";
  height: ${config.toggleHeight - 2 * config.togglePadding}px;
  width: ${config.toggleHeight - 2 * config.togglePadding}px;
  left: ${config.togglePadding}px;
  bottom: ${config.togglePadding}px;
  background-color: ${config.backgroundColor};
  transition: ${config.animationDuration}s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: ${config.primaryColor};
}

input:checked + .slider:before {
  transform: translateX(${config.toggleWidth - config.toggleHeight}px);
}

.toggle-label {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: ${config.labelColor};
  transition: opacity ${config.animationDuration}s;
}

.toggle-label.on {
  left: ${config.togglePadding}px;
  opacity: ${isChecked ? 1 : 0};
}

.toggle-label.off {
  right: ${config.togglePadding}px;
  opacity: ${isChecked ? 0 : 1};
}`;

    setCssCode(css);

    // Update HTML code
    const html = `
<label class="toggle">
  <input type="checkbox">
  <span class="slider">
    ${config.showLabels ? `
    <span class="toggle-label on">${config.labelOn}</span>
    <span class="toggle-label off">${config.labelOff}</span>
    ` : ''}
  </span>
</label>`;

    setHtmlCode(html);

    // Update JS code
    const js = `
const toggle = document.querySelector('.toggle input');
const root = document.documentElement;

root.style.setProperty('--color-background', '${config.backgroundColor}');
root.style.setProperty('--color-primary', '${config.primaryColor}');
root.style.setProperty('--color-secondary', '${config.secondaryColor}');
root.style.setProperty('--toggle-width', '${config.toggleWidth}px');
root.style.setProperty('--toggle-height', '${config.toggleHeight}px');
root.style.setProperty('--toggle-padding', '${config.togglePadding}px');
root.style.setProperty('--toggle-animation-duration', '${config.animationDuration}s');
root.style.setProperty('--toggle-border-radius', '${config.borderRadius}px');
root.style.setProperty('--label-color', '${config.labelColor}');

toggle.addEventListener('change', function() {
  const labels = document.querySelectorAll('.toggle-label');
  labels.forEach(label => {
    label.style.opacity = label.classList.contains('on') === this.checked ? '1' : '0';
  });
});`;

    setJsCode(js);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Toggle Preview</h2>
        <div style={{ backgroundColor: config.backgroundColor, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <label
            style={{
              position: 'relative',
              display: 'inline-block',
              width: `${config.toggleWidth}px`,
              height: `${config.toggleHeight}px`,
            }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: isChecked ? config.primaryColor : config.secondaryColor,
                transition: `${config.animationDuration}s`,
                borderRadius: `${config.borderRadius}px`,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  content: '""',
                  height: `${config.toggleHeight - 2 * config.togglePadding}px`,
                  width: `${config.toggleHeight - 2 * config.togglePadding}px`,
                  left: isChecked ? `${config.toggleWidth - config.toggleHeight + config.togglePadding}px` : `${config.togglePadding}px`,
                  bottom: `${config.togglePadding}px`,
                  backgroundColor: config.backgroundColor,
                  transition: `${config.animationDuration}s`,
                  borderRadius: '50%',
                }}
              />
              {config.showLabels && (
                <>
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${config.togglePadding}px`,
                      transform: 'translateY(-50%)',
                      color: config.labelColor,
                      fontSize: '12px',
                      opacity: isChecked ? 1 : 0,
                      transition: `opacity ${config.animationDuration}s`,
                    }}
                  >
                    {config.labelOn}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: `${config.togglePadding}px`,
                      transform: 'translateY(-50%)',
                      color: config.labelColor,
                      fontSize: '12px',
                      opacity: isChecked ? 0 : 1,
                      transition: `opacity ${config.animationDuration}s`,
                    }}
                  >
                    {config.labelOff}
                  </span>
                </>
              )}
            </span>
          </label>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Configuration</h2>
        <div className="space-y-4">
        <div>
            <label htmlFor="backgroundColor" className="block">Background Color:</label>
            <input
              type="color"
              id="backgroundColor"
              value={config.backgroundColor}
              onChange={(e) => updateConfig('backgroundColor', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="primaryColor" className="block">Primary Color:</label>
            <input
              type="color"
              id="primaryColor"
              value={config.primaryColor}
              onChange={(e) => updateConfig('primaryColor', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="secondaryColor" className="block">Secondary Color:</label>
            <input
              type="color"
              id="secondaryColor"
              value={config.secondaryColor}
              onChange={(e) => updateConfig('secondaryColor', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="toggleWidth" className="block">Toggle Width (px):</label>
            <input
              type="range"
              id="toggleWidth"
              min="40"
              max="100"
              value={config.toggleWidth}
              onChange={(e) => updateConfig('toggleWidth', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="toggleHeight" className="block">Toggle Height (px):</label>
            <input
              type="range"
              id="toggleHeight"
              min="20"
              max="60"
              value={config.toggleHeight}
              onChange={(e) => updateConfig('toggleHeight', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="togglePadding" className="block">Toggle Padding (px):</label>
            <input
              type="range"
              id="togglePadding"
              min="1"
              max="10"
              value={config.togglePadding}
              onChange={(e) => updateConfig('togglePadding', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="animationDuration" className="block">Animation Duration (s):</label>
            <input
              type="range"
              id="animationDuration"
              min="0.1"
              max="1"
              step="0.1"
              value={config.animationDuration}
              onChange={(e) => updateConfig('animationDuration', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="borderRadius" className="block">Border Radius (px):</label>
            <input
              type="range"
              id="borderRadius"
              min="0"
              max="30"
              value={config.borderRadius}
              onChange={(e) => updateConfig('borderRadius', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="showLabels" className="block">Show Labels:</label>
            <input
              type="checkbox"
              id="showLabels"
              checked={config.showLabels}
              onChange={(e) => updateConfig('showLabels', e.target.checked)}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="labelOn" className="block">Label (ON):</label>
            <input
              type="text"
              id="labelOn"
              value={config.labelOn}
              onChange={(e) => updateConfig('labelOn', e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="labelOff" className="block">Label (OFF):</label>
            <input
              type="text"
              id="labelOff"
              value={config.labelOff}
              onChange={(e) => updateConfig('labelOff', e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="labelColor" className="block">Label Color:</label>
            <input
              type="color"
              id="labelColor"
              value={config.labelColor}
              onChange={(e) => updateConfig('labelColor', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Generated Code</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold">HTML</h3>
            <pre className="bg-gray-100 p-4 rounded">{htmlCode}</pre>
          </div>
          <div>
            <h3 className="text-xl font-bold">CSS</h3>
            <pre className="bg-gray-100 p-4 rounded">{cssCode}</pre>
          </div>
          <div>
            <h3 className="text-xl font-bold">JavaScript</h3>
            <pre className="bg-gray-100 p-4 rounded">{jsCode}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}