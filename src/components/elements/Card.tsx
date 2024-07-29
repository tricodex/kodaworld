'use client';
import React, { useState, useEffect } from 'react'

export default function Card() {
  const [config, setConfig] = useState({
    backgroundColor: '#ffffff',
    textColor: '#333333',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    boxShadow: 10,
    width: 300,
    imageBorderRadius: 0,
    titleText: 'Card Title',
    contentText: 'This is a customizable card element.',
    buttonText: 'Action Button',
    buttonColor: '#007bff',
    buttonTextColor: '#ffffff',
    buttonBorderRadius: 5,
    buttonPadding: 10,
    buttonMarginBottom: 20
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
    // Update CSS code
    const css = `
.happy-card {
  background-color: ${config.backgroundColor};
  color: ${config.textColor};
  border: ${config.borderWidth}px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  box-shadow: 0 ${config.boxShadow / 2}px ${config.boxShadow}px rgba(0, 0, 0, 0.1);
  width: ${config.width}px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.happy-card img {
  width: 100%;
  border-radius: ${config.imageBorderRadius}px ${config.imageBorderRadius}px 0 0;
  margin-bottom: 15px;
}

.happy-card h2 {
  margin: 0 0 10px 0;
}

.happy-card p {
  margin: 0 0 20px 0;
  text-align: center;
}

.happy-card button {
  background-color: ${config.buttonColor};
  color: ${config.buttonTextColor};
  border: none;
  padding: ${config.buttonPadding}px;
  border-radius: ${config.buttonBorderRadius}px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  margin-bottom: ${config.buttonMarginBottom}px;
}

.happy-card button:hover {
  opacity: 0.8;
}`;

    setCssCode(css);

    // Update HTML code
    const html = `
<div class="happy-card">
  <img src="https://via.placeholder.com/300x200" alt="Card image">
  <h2>${config.titleText}</h2>
  <p>${config.contentText}</p>
  <button>${config.buttonText}</button>
</div>`;

    setHtmlCode(html);

    // Update JS code
    const js = `
const card = document.querySelector('.happy-card');
card.style.backgroundColor = '${config.backgroundColor}';
card.style.color = '${config.textColor}';
card.style.border = '${config.borderWidth}px solid ${config.borderColor}';
card.style.borderRadius = '${config.borderRadius}px';
card.style.boxShadow = '0 ${config.boxShadow / 2}px ${config.boxShadow}px rgba(0, 0, 0, 0.1)';
card.style.width = '${config.width}px';

const image = card.querySelector('img');
image.style.borderRadius = '${config.imageBorderRadius}px ${config.imageBorderRadius}px 0 0';

const button = card.querySelector('button');
button.style.backgroundColor = '${config.buttonColor}';
button.style.color = '${config.buttonTextColor}';
button.style.borderRadius = '${config.buttonBorderRadius}px';
button.style.padding = '${config.buttonPadding}px';
button.style.marginBottom = '${config.buttonMarginBottom}px';`;

    setJsCode(js);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Card Preview</h2>
        <div
          style={{
            backgroundColor: config.backgroundColor,
            color: config.textColor,
            border: `${config.borderWidth}px solid ${config.borderColor}`,
            borderRadius: `${config.borderRadius}px`,
            boxShadow: `0 ${config.boxShadow / 2}px ${config.boxShadow}px rgba(0, 0, 0, 0.1)`,
            width: `${config.width}px`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <img
            src="https://via.placeholder.com/300x200"
            alt="Card image"
            style={{
              width: '100%',
              borderRadius: `${config.imageBorderRadius}px ${config.imageBorderRadius}px 0 0`,
              marginBottom: '15px',
            }}
          />
          <h2>{config.titleText}</h2>
          <p>{config.contentText}</p>
          <button
            style={{
              backgroundColor: config.buttonColor,
              color: config.buttonTextColor,
              border: 'none',
              padding: `${config.buttonPadding}px`,
              borderRadius: `${config.buttonBorderRadius}px`,
              cursor: 'pointer',
              transition: 'opacity 0.3s ease',
              marginBottom: `${config.buttonMarginBottom}px`,
            }}
          >
            {config.buttonText}
          </button>
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Configuration</h2>
        <div className="space-y-4">
          {/* Add input fields for each configuration option */}
          {/* Example for backgroundColor */}
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
          {/* Add similar input fields for other configuration options */}
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