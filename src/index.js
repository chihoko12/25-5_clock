import React from 'react';
import ReactDOM from 'react-dom';
import './styles/styles.css';
import reportWebVitals from './reportWebVitals';
import Clock from './components/Clock'

const app = ReactDOM.createRoot(document.getElementById('app'));
app.render(
  <React.StrictMode>
    <Clock />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
