import * as React from 'react';
import { render } from 'react-dom';

import App from './App';

render(
  <App compiler="TypeScript" framework="React" />,
  document.getElementById('root')
);
