'use client';
import React, { useState, useEffect } from 'react'

export default function Article() {
  const [config, setConfig] = useState({
    backgroundColor: '#f0f0f0',
    textColor: '#333333',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 20,
    maxWidth: 600,
    titleText: 'Happy Article',
    contentText: 'This is a configurable article element.'
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
.happy-article {
  background-color: ${config.backgroundColor};
  color: ${config.textColor};
  border: ${config.borderWidth}px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  padding: ${config.padding}px;
  max-width: ${config.maxWidth}px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.happy-article h2 {
  margin-top: 0;
}`;

    setCssCode(css);

    // Update HTML code
    const html = `
<article class="happy-article">
  <h2>${config.titleText}</h2>
  <p>${config.contentText}</p>
</article>`;

    setHtmlCode(html);

    // Update JS code
    const js = `
const article = document.querySelector('.happy-article');
article.style.backgroundColor = '${config.backgroundColor}';
article.style.color = '${config.textColor}';
article.style.border = '${config.borderWidth}px solid ${config.borderColor}';
article.style.borderRadius = '${config.borderRadius}px';
article.style.padding = '${config.padding}px';
article.style.maxWidth = '${config.maxWidth}px';`;

    setJsCode(js);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Article Preview</h2>
        <article
          style={{
            backgroundColor: config.backgroundColor,
            color: config.textColor,
            border: `${config.borderWidth}px solid ${config.borderColor}`,
            borderRadius: `${config.borderRadius}px`,
            padding: `${config.padding}px`,
            maxWidth: `${config.maxWidth}px`,
            margin: '0 auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h2>{config.titleText}</h2>
          <p>{config.contentText}</p>
        </article>

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
            <label htmlFor="padding" className="block">Padding (px):</label>
            <input
              type="range"
              id="padding"
              min="0"
              max="50"
              value={config.padding}
              onChange={(e) => updateConfig('padding', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="maxWidth" className="block">Max Width (px):</label>
            <input
              type="range"
              id="maxWidth"
              min="200"
              max="1000"
              value={config.maxWidth}
              onChange={(e) => updateConfig('maxWidth', parseInt(e.target.value))}
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