import React,{Component}  from 'react';
// import './App.css';
import Main from './components/Main';
import {BrowserRouter} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div>
      {/* <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Welcome to Home Finder</h1> */}
      {/* App Component Has a Child Component called Main*/}
      <Main/>
    </div>
  </BrowserRouter>
  );
}
export default App;
