import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const rootElement = document.getElementById("blox-fruits-calculator");
    
    if (rootElement) {
        // Check if React is already running on this element
        if (!rootElement.hasAttribute('data-react-initialized')) {
            const root = createRoot(rootElement);
            root.render(<App />);
            
            // Mark the element as initialized
            rootElement.setAttribute('data-react-initialized', 'true');
        }
    }
});