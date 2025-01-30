import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("blox-fruits-calculator-root");
  
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error("Could not find root element with ID 'blox-fruits-calculator-root'");
  }
});