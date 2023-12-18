import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Buy from './Components/Buy';
import Cart from './Components/Cart';
import EditDisplay from './Components/EditDisplay';
import EditMedicine from './Components/EditMedicine';
import Home from './Components/Home';
import Medicines from './Components/Medicines';
import Navigation from './Components/Navigation';

function App() {
  
  return (
    <React.Fragment>
    <div className="App">
    
      <Router>
      <Navigation/>
        <Routes>
          <Route path="/Medicines" element={<Medicines/>} exact/>
          <Route path="/Edit" element={<EditDisplay/>} exact/>
          <Route path="/editMedicine/:id" element={<EditMedicine/>} exact/>
          <Route path="/buy" element={<Buy/>} exact/>
          <Route path="/cart/:name" element={<Cart/>} exact/>
          <Route path="/" element={<Home/>} exact/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
    </React.Fragment>
  );
}

export default App;
