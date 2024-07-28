'use client';
import React, { useState, useEffect } from 'react'

export default function Button() {
  const [config, setConfig] = useState({
    hue: 0,
    saturation: 100,
    lightness: 50,
    borderWidth: 0,
    borderRadius: 25,
    glowIntensity: 50,
    textColor: '#ffffff',
    fontSize: 24,
    padding: 20,
    boxShadow: 10,
    buttonText: 'Happy Button'
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

  function updateCodes() {
    const backgroundColor = `hsl(${config.hue}, ${config.saturation}%, ${config.lightness}%)`;
    
    // Update CSS code
    const css = `
.happy-button {
  background-color: ${backgroundColor};
  color: ${config.textColor};
  border-radius: ${config.borderRadius}px;
  border: ${config.borderWidth}px solid ${config.textColor};
  font-size: ${config.fontSize}px;
  padding: ${config.padding}px;
  box-shadow: 0 ${config.boxShadow}px ${config.boxShadow * 2}px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.happy-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.happy-button:active {
  transform: translateY(0);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.happy-button::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  filter: blur(${config.glowIntensity / 2}px);
  opacity: ${config.glowIntensity / 100};
  z-index: -1;
  background: radial-gradient(circle, hsl(${config.hue}, ${config.saturation}%, ${config.lightness + 10}%), hsl(${config.hue}, ${config.saturation}%, ${config.lightness - 10}%));
}`;

    setCssCode(css);

    // Update HTML code
    const html = `
<button class="happy-button">
  ${config.buttonText}
</button>`;

    setHtmlCode(html);

    // Update JS code
    const js = `
const button = document.querySelector('.happy-button');
button.style.backgroundColor = '${backgroundColor}';
button.style.color = '${config.textColor}';
button.style.borderRadius = '${config.borderRadius}px';
button.style.border = '${config.borderWidth}px solid ${config.textColor}';
button.style.fontSize = '${config.fontSize}px';
button.style.padding = '${config.padding}px';
button.style.boxShadow = '0 ${config.boxShadow}px ${config.boxShadow * 2}px rgba(0, 0, 0, 0.1)';`;

    setJsCode(js);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Button Preview</h2>
        <button
          className="happy-button"
          style={{
            backgroundColor: `hsl(${config.hue}, ${config.saturation}%, ${config.lightness}%)`,
            color: config.textColor,
            borderRadius: `${config.borderRadius}px`,
            border: `${config.borderWidth}px solid ${config.textColor}`,
            fontSize: `${config.fontSize}px`,
            padding: `${config.padding}px`,
            boxShadow: `0 ${config.boxShadow}px ${config.boxShadow * 2}px rgba(0, 0, 0, 0.1)`,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {config.buttonText}
          <span
            className="glow"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              filter: `blur(${config.glowIntensity / 2}px)`,
              opacity: config.glowIntensity / 100,
              zIndex: -1,
              background: `radial-gradient(circle, hsl(${config.hue}, ${config.saturation}%, ${config.lightness + 10}%), hsl(${config.hue}, ${config.saturation}%, ${config.lightness - 10}%))`,
            }}
          />
        </button>

        <h2 className="text-2xl font-bold mt-8 mb-4">Configuration</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="hue" className="block">Hue:</label>
            <input
              type="range"
              id="hue"
              min="0"
              max="359"
              value={config.hue}
              onChange={(e) => updateConfig('hue', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="saturation" className="block">Saturation:</label>
            <input
              type="range"
              id="saturation"
              min="0"
              max="100"
              value={config.saturation}
              onChange={(e) => updateConfig('saturation', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="lightness" className="block">Lightness:</label>
            <input
              type="range"
              id="lightness"
              min="0"
              max="100"
              value={config.lightness}
              onChange={(e) => updateConfig('lightness', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="borderWidth" className="block">Border Width:</label>
            <input
              type="range"
              id="borderWidth"
              min="0"
              max="10"
              value={config.borderWidth}
              onChange={(e) => updateConfig('borderWidth', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="borderRadius" className="block">Border Radius:</label>
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
            <label htmlFor="glowIntensity" className="block">Glow Intensity:</label>
            <input
              type="range"
              id="glowIntensity"
              min="0"
              max="100"
              value={config.glowIntensity}
              onChange={(e) => updateConfig('glowIntensity', parseInt(e.target.value))}
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
            <label htmlFor="fontSize" className="block">Font Size (px):</label>
            <input
              type="range"
              id="fontSize"
              min="12"
              max="48"
              value={config.fontSize}
              onChange={(e) => updateConfig('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="padding" className="block">Padding (px):</label>
            <input
              type="range"
              id="padding"
              min="5"
              max="50"
              value={config.padding}
              onChange={(e) => updateConfig('padding', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="boxShadow" className="block">Box Shadow:</label>
            <input
              type="range"
              id="boxShadow"
              min="0"
              max="30"
              value={config.boxShadow}
              onChange={(e) => updateConfig('boxShadow', parseInt(e.target.value))}
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