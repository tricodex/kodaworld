'use client';
import React, { useState, useEffect, useRef } from 'react'

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
    buttonMarginBottom: 20,
    maxHeight: 400,
  });

  const [cssCode, setCssCode] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    updateCodes();
  }, [config, image]);

  function updateConfig(key: string, value: any) {
    setConfig(prev => ({ ...prev, [key]: value }));
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
  max-height: ${config.maxHeight}px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.happy-card-content {
  width: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #888888 #f0f0f0;
}

.happy-card-content::-webkit-scrollbar {
  width: 6px;
}

.happy-card-content::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.happy-card-content::-webkit-scrollbar-thumb {
  background-color: #888888;
  border-radius: 3px;
}

.happy-card img {
  width: 100%;
  border-radius: ${config.imageBorderRadius}px ${config.imageBorderRadius}px 0 0;
  margin-bottom: 15px;
  object-fit: cover;
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
  <div class="happy-card-content">
    <img src="${image || 'https://via.placeholder.com/300x200'}" alt="Card image">
    <h2>${config.titleText}</h2>
    <p>${config.contentText}</p>
  </div>
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
card.style.maxHeight = '${config.maxHeight}px';

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
            maxHeight: `${config.maxHeight}px`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <div style={{ width: '100%', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#888888 #f0f0f0' }}>
            <img
              src={image || "https://via.placeholder.com/300x200"}
              alt="Card image"
              style={{
                width: '100%',
                borderRadius: `${config.imageBorderRadius}px ${config.imageBorderRadius}px 0 0`,
                marginBottom: '15px',
                objectFit: 'cover',
              }}
            />
            <h2>{config.titleText}</h2>
            <p>{config.contentText}</p>
          </div>
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
            <label htmlFor="borderColor" className="block">Border Color:</label>
            <input
              type="color"
              id="borderColor"
              value={config.borderColor}
              onChange={(e) => updateConfig('borderColor', e.target.value)}
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
            <label htmlFor="boxShadow" className="block">Box Shadow:</label>
            <input
              type="range"
              id="boxShadow"
              min="0"
              max="50"
              value={config.boxShadow}
              onChange={(e) => updateConfig('boxShadow', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="width" className="block">Width:</label>
            <input
              type="range"
              id="width"
              min="200"
              max="600"
              value={config.width}
              onChange={(e) => updateConfig('width', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="imageBorderRadius" className="block">Image Border Radius:</label>
            <input
              type="range"
              id="imageBorderRadius"
              min="0"
              max="50"
              value={config.imageBorderRadius}
              onChange={(e) => updateConfig('imageBorderRadius', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="titleText" className="block">Title Text:</label>
            <input
              type="text"
              id="titleText"
              value={config.titleText}
              onChange={(e) => updateConfig('titleText', e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="contentText" className="block">Content Text:</label>
            <textarea
              id="contentText"
              value={config.contentText}
              onChange={(e) => updateConfig('contentText', e.target.value)}
              className="w-full border rounded p-2"
              rows={4}
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
            <label htmlFor="buttonColor" className="block">Button Color:</label>
            <input
              type="color"
              id="buttonColor"
              value={config.buttonColor}
              onChange={(e) => updateConfig('buttonColor', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="buttonTextColor" className="block">Button Text Color:</label>
            <input
              type="color"
              id="buttonTextColor"
              value={config.buttonTextColor}
              onChange={(e) => updateConfig('buttonTextColor', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="buttonBorderRadius" className="block">Button Border Radius:</label>
            <input
              type="range"
              id="buttonBorderRadius"
              min="0"
              max="50"
              value={config.buttonBorderRadius}
              onChange={(e) => updateConfig('buttonBorderRadius', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="buttonPadding" className="block">Button Padding:</label>
            <input
              type="range"
              id="buttonPadding"
              min="5"
              max="30"
              value={config.buttonPadding}
              onChange={(e) => updateConfig('buttonPadding', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="buttonMarginBottom" className="block">Button Bottom Margin:</label>
            <input
              type="range"
              id="buttonMarginBottom"
              min="0"
              max="50"
              value={config.buttonMarginBottom}
              onChange={(e) => updateConfig('buttonMarginBottom', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="maxHeight" className="block">Max Height (px):</label>
            <input
              type="range"
              id="maxHeight"
              min="200"
              max="800"
              value={config.maxHeight}
              onChange={(e) => updateConfig('maxHeight', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="imageUpload" className="block">Upload Image:</label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
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