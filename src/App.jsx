import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Homepage from './pages/Homepage';
import SignUp from './pages/Signup';
import SignIn from './pages/SignIn';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import ItemDetail from './pages/ItemDetail';
import NewItem from './pages/NewItem';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userInfo = JSON.parse(atob(token.split('.')[1])).payload;
        setUser(userInfo);
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <div style={{ padding: '1.5rem' }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/items/new" element={user ? <NewItem /> : <Navigate to='/sign-in' />} />
          <Route path="/items/:id" element={<ItemDetail user={user} />} />
          <Route path="/sign-up" element={!user ? <SignUp /> : <Navigate to='/dashboard' />} />
          <Route path="/sign-in" element={!user ? <SignIn setUser={setUser} /> : <Navigate to='/dashboard' />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to='/sign-in' />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;