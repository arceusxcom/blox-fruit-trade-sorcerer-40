import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("blox-fruits-calculator-root");
  
  if (rootElement) {
    try {
      const root = createRoot(rootElement);
      root.render(<App />);
    } catch (error) {
      console.error('Failed to initialize Blox Fruits Calculator:', error);
    }
  } else {
    console.warn('Root element for Blox Fruits Calculator not found');
  }
});