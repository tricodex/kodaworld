'use client';
import React, { useState, useEffect } from 'react'

export default function DownloadButton() {
  const [config, setConfig] = useState({
    backgroundColor: '#110d1a',
    primaryColor: '#b197fc',
    textColor: '#ffffff',
    animationDuration: 0.6,
    animationScale: 1.5,
    hoverTranslate: 5,
    borderRadius: 8,
    fontSize: 19,
    iconSize: 24,
    buttonWidth: 200,
    buttonHeight: 60,
    shadowSize: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    buttonText: 'Download',
    iconPosition: 'left'
  });

  const [cssCode, setCssCode] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [jsCode, setJsCode] = useState('');

  useEffect(() => {
    updateCodes();
  }, [config]);

  function updateConfig(key: string, value: any) {
    setConfig(prev => ({ ...prev, [key]: value }));
  }

  function hexToRgba(hex: string, opacity: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  function updateCodes() {
    // Update CSS code
    const css = `
:root {
  --color-background: ${config.backgroundColor};
  --color-primary: ${config.primaryColor};
  --color-text: ${config.textColor};
  --animation-duration: ${config.animationDuration}s;
  --animation-scale: ${config.animationScale};
  --hover-translate: -${config.hoverTranslate}px;
  --font-size: ${config.fontSize}px;
  --icon-size: ${config.iconSize}px;
  --button-width: ${config.buttonWidth}px;
  --button-height: ${config.buttonHeight}px;
  --shadow-color: ${hexToRgba(config.shadowColor, config.shadowOpacity)};
  --shadow-size: 0px ${config.shadowSize}px ${config.shadowSize * 1.5}px;
}

.c-btn {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  text-decoration: none;
  border-radius: ${config.borderRadius}px;
  background-color: var(--color-primary);
  backface-visibility: hidden;
  box-shadow: var(--shadow-size) var(--shadow-color);
  transform: translateZ(0);
  font-size: var(--font-size);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: var(--button-width);
  height: var(--button-height);
}

.c-btn::after {
  content: "";
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 120%;
  width: 120%;
  border-radius: 20%;
  background-color: var(--color-background);
  scale: 0 0;
  translate: 0 140%;
  transition: scale var(--animation-duration) cubic-bezier(0.215, 0.61, 0.355, 1),
      translate var(--animation-duration) cubic-bezier(0.215, 0.61, 0.355, 1);
}

.c-btn__label {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  z-index: 2;
  letter-spacing: 0.025em;
  transition: color 0.32s ease-in-out;
}

.c-btn:hover {
  transform: translateY(var(--hover-translate));
  box-shadow: var(--shadow-size) var(--shadow-color);
}

.c-btn:hover .c-btn__label {
  color: var(--color-primary);
}

.c-btn:hover::after {
  scale: var(--animation-scale) var(--animation-scale);
  translate: 0 0;
  border-radius: 50%;
}

.c-btn svg {
  width: var(--icon-size);
  height: var(--icon-size);
}`;

    setCssCode(css);

    // Update HTML code
    const html = `
<a href="#" class="c-btn">
  <span class="c-btn__label">
    ${config.iconPosition === 'left' ? `
    <svg xmlns="http://www.w3.org/2000/svg" width="${config.iconSize}" height="${config.iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    ` : ''}
    ${config.buttonText}
    ${config.iconPosition === 'right' ? `
    <svg xmlns="http://www.w3.org/2000/svg" width="${config.iconSize}" height="${config.iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    ` : ''}
  </span>
</a>`;

    setHtmlCode(html);

    // Update JS code
    const js = `
document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.c-btn');
  const root = document.documentElement;

  root.style.setProperty('--color-background', '${config.backgroundColor}');
  root.style.setProperty('--color-primary', '${config.primaryColor}');
  root.style.setProperty('--color-text', '${config.textColor}');
  root.style.setProperty('--animation-duration', '${config.animationDuration}s');
  root.style.setProperty('--animation-scale', '${config.animationScale}');
  root.style.setProperty('--hover-translate', '-${config.hoverTranslate}px');
  root.style.setProperty('--font-size', '${config.fontSize}px');
  root.style.setProperty('--icon-size', '${config.iconSize}px');
  root.style.setProperty('--button-width', '${config.buttonWidth}px');
  root.style.setProperty('--button-height', '${config.buttonHeight}px');
  
  const shadowColor = '${hexToRgba(config.shadowColor, config.shadowOpacity)}';
  root.style.setProperty('--shadow-color', shadowColor);
  root.style.setProperty('--shadow-size', '0px ${config.shadowSize}px ${config.shadowSize * 1.5}px');
  
  button.style.borderRadius = '${config.borderRadius}px';
});`;

    setJsCode(js);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Download Button Preview</h2>
        <div style={{ backgroundColor: config.backgroundColor, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <a
            href="#"
            className="c-btn"
            style={{
              '--color-background': config.backgroundColor,
              '--color-primary': config.primaryColor,
              '--color-text': config.textColor,
              '--animation-duration': `${config.animationDuration}s`,
              '--animation-scale': config.animationScale,
              '--hover-translate': `-${config.hoverTranslate}px`,
              '--font-size': `${config.fontSize}px`,
              '--icon-size': `${config.iconSize}px`,
              '--button-width': `${config.buttonWidth}px`,
              '--button-height': `${config.buttonHeight}px`,
              '--shadow-color': hexToRgba(config.shadowColor, config.shadowOpacity),
              '--shadow-size': `0px ${config.shadowSize}px ${config.shadowSize * 1.5}px`,
              borderRadius: `${config.borderRadius}px`,
            } as React.CSSProperties}
          >
            <span className="c-btn__label">
              {config.iconPosition === 'left' && (
                <svg xmlns="http://www.w3.org/2000/svg" width={config.iconSize} height={config.iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              )}
              {config.buttonText}
              {config.iconPosition === 'right' && (
                <svg xmlns="http://www.w3.org/2000/svg" width={config.iconSize} height={config.iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              )}
            </span>
          </a>
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
            <label htmlFor="animationDuration" className="block">Animation Duration (s):</label>
            <input
              type="range"
              id="animationDuration"
              min="0.1"
              max="2"
              step="0.1"
              value={config.animationDuration}
              onChange={(e) => updateConfig('animationDuration', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="animationScale" className="block">Animation Scale:</label>
            <input
              type="range"
              id="animationScale"
              min="1"
              max="3"
              step="0.1"
              value={config.animationScale}
              onChange={(e) => updateConfig('animationScale', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="hoverTranslate" className="block">Hover Translate (px):</label>
            <input
              type="range"
              id="hoverTranslate"
              min="0"
              max="20"
              value={config.hoverTranslate}
              onChange={(e) => updateConfig('hoverTranslate', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="borderRadius" className="block">Border Radius (px):</label>
            <input
              type="range"
              id="borderRadius"
              min="0"
              max="50"
              value={config.borderRadius}
              onChange={(e) => updateConfig('borderRadius', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="fontSize" className="block">Font Size (px):</label>
            <input
              type="range"
              id="fontSize"
              min="12"
              max="32"
              value={config.fontSize}
              onChange={(e) => updateConfig('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="iconSize" className="block">Icon Size (px):</label>
            <input
              type="range"
              id="iconSize"
              min="16"
              max="48"
              value={config.iconSize}
              onChange={(e) => updateConfig('iconSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="buttonWidth" className="block">Button Width (px):</label>
            <input
              type="range"
              id="buttonWidth"
              min="100"
              max="300"
              value={config.buttonWidth}
              onChange={(e) => updateConfig('buttonWidth', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="buttonHeight" className="block">Button Height (px):</label>
            <input
              type="range"
              id="buttonHeight"
              min="40"
              max="100"
              value={config.buttonHeight}
              onChange={(e) => updateConfig('buttonHeight', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="shadowSize" className="block">Shadow Size (px):</label>
            <input
              type="range"
              id="shadowSize"
              min="0"
              max="20"
              value={config.shadowSize}
              onChange={(e) => updateConfig('shadowSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="shadowColor" className="block">Shadow Color:</label>
            <input
              type="color"
              id="shadowColor"
              value={config.shadowColor}
              onChange={(e) => updateConfig('shadowColor', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="shadowOpacity" className="block">Shadow Opacity:</label>
            <input
              type="range"
              id="shadowOpacity"
              min="0"
              max="1"
              step="0.1"
              value={config.shadowOpacity}
              onChange={(e) => updateConfig('shadowOpacity', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="textColor" className="block">Text Color:</label>
            <input
              type="color"
              id="textColor"
              value={config.textColor}
              onChange={(e) => updateConfig('textColor', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="buttonText" className="block">Button Text:</label>
            <input
              type="text"
              id="buttonText"
              value={config.buttonText}
              onChange={(e) => updateConfig('buttonText', e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="iconPosition" className="block">Icon Position:</label>
            <select
              id="iconPosition"
              value={config.iconPosition}
              onChange={(e) => updateConfig('iconPosition', e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
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