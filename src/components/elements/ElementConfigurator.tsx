import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export default function ElementConfigurator() {
  const [elementType, setElementType] = useState('button');
  const [properties, setProperties] = useState({
    backgroundColor: '#2e394d',
    primaryColor: '#b197fc',
    secondaryColor: '#ffffff',
    width: 100,
    height: 50,
    padding: 10,
    animationDuration: 0.3,
    borderRadius: 5,
    label: 'Click Me',
    showLabel: true,
    labelColor: '#ffffff'
  });

  const [generatedCode, setGeneratedCode] = useState({ html: '', css: '', js: '' });

  useEffect(() => {
    async function fetchGeneratedCode() {
      try {
        const response = await fetch('/api/generate_element', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ elementType, properties }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch generated code');
        }
        const result = await response.json();
        setGeneratedCode(result);
      } catch (error) {
        console.error('Error fetching generated code:', error);
      }
    }
    fetchGeneratedCode();
  }, [elementType, properties]);

  function updateProperties(key, value) {
    setProperties((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <h2 className="text-2xl font-bold">Element Preview</h2>
        </CardHeader>
        <CardContent>
          <div style={{ backgroundColor: properties.backgroundColor, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div dangerouslySetInnerHTML={{ __html: generatedCode.html }}></div>
            <style>{generatedCode.css}</style>
            <script dangerouslySetInnerHTML={{ __html: generatedCode.js }}></script>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4">Configuration</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="backgroundColor">Background Color:</Label>
              <Input
                type="color"
                id="backgroundColor"
                value={properties.backgroundColor}
                onChange={(e) => updateProperties('backgroundColor', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="primaryColor">Primary Color:</Label>
              <Input
                type="color"
                id="primaryColor"
                value={properties.primaryColor}
                onChange={(e) => updateProperties('primaryColor', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="secondaryColor">Secondary Color:</Label>
              <Input
                type="color"
                id="secondaryColor"
                value={properties.secondaryColor}
                onChange={(e) => updateProperties('secondaryColor', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="width">Width: {properties.width}px</Label>
              <Slider
                id="width"
                min={50}
                max={200}
                value={[properties.width]}
                onValueChange={(value) => updateProperties('width', value[0])}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="height">Height: {properties.height}px</Label>
              <Slider
                id="height"
                min={20}
                max={100}
                value={[properties.height]}
                onValueChange={(value) => updateProperties('height', value[0])}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="padding">Padding: {properties.padding}px</Label>
              <Slider
                id="padding"
                min={5}
                max={20}
                value={[properties.padding]}
                onValueChange={(value) => updateProperties('padding', value[0])}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="animationDuration">Animation Duration: {properties.animationDuration}s</Label>
              <Slider
                id="animationDuration"
                min={0.1}
                max={1}
                step={0.1}
                value={[properties.animationDuration]}
                onValueChange={(value) => updateProperties('animationDuration', value[0])}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="borderRadius">Border Radius: {properties.borderRadius}px</Label>
              <Slider
                id="borderRadius"
                min={0}
                max={30}
                value={[properties.borderRadius]}
                onValueChange={(value) => updateProperties('borderRadius', value[0])}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="showLabel"
                checked={properties.showLabel}
                onCheckedChange={(checked) => updateProperties('showLabel', checked)}
              />
              <Label htmlFor="showLabel">Show Label</Label>
            </div>
            <div>
              <Label htmlFor="label">Label:</Label>
              <Input
                type="text"
                id="label"
                value={properties.label}
                onChange={(e) => updateProperties('label', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="labelColor">Label Color:</Label>
              <Input
                type="color"
                id="labelColor"
                value={properties.labelColor}
                onChange={(e) => updateProperties('labelColor', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <h2 className="text-2xl font-bold">Generated Code</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">HTML</h3>
              <pre className="bg-gray-100 p-4 rounded">{generatedCode.html}</pre>
            </div>
            <div>
              <h3 className="text-xl font-bold">CSS</h3>
              <pre className="bg-gray-100 p-4 rounded">{generatedCode.css}</pre>
            </div>
            <div>
              <h3 className="text-xl font-bold">JavaScript</h3>
              <pre className="bg-gray-100 p-4 rounded">{generatedCode.js}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
