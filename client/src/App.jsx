import './App.css';
import SideNav from './components/sidenav/SideNav';
import MainPage from './pages/mainpage';

import { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/index').then(response => response.text()).then(text => setMessage(text));
  })

  return (
    <div className="App">
      <SideNav />
      <div className="page">
        <MainPage />
      </div>
    </div>
  );
}

export default App;
