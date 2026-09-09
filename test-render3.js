import { renderToString } from 'react-dom/server';
import React from 'react';
import App from './src/App.jsx';

try {
  renderToString(<App />);
  console.log("Render successful");
} catch (e) {
  console.error("Render failed:", e);
}
