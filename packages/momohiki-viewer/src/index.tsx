import { createRoot } from 'react-dom/client';
import { App } from './App';

const hastText = document.getElementById('app-source')?.textContent;
const hast = hastText ? JSON.parse(hastText) : {};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App hast={hast} />);
}
