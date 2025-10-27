import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import ChatBuddy from './components/ChatBuddy';
import DocumentTools from './components/DocumentTools';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [currentView, setCurrentView] = useState('chat');
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
  };
  if (!isLoggedIn) {
    return (
      <Auth 
        setToken={setToken} 
        setIsLoggedIn={setIsLoggedIn} 
      />
    );
  }
  return (
    <div className="app-container">
      <header>
        <h1>AI Study Buddy 🤖</h1>
        <nav>
          <button onClick={() => setCurrentView('chat')}>Chat</button>
          <button onClick={() => setCurrentView('docs')}>Document Tools</button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <main>
        {currentView === 'chat' && <ChatBuddy token={token} />}
        {currentView === 'docs' && <DocumentTools token={token} />}
      </main>
    </div>
  );
};

export default App;