import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Homepage from './pages/Homepage';
import SignUp from './pages/Signup';
import SignIn from './pages/SignIn';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import ItemDetail from './pages/ItemDetail';
import NewItem from './pages/NewItem';
import AboutUs from './pages/AboutUs';

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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} setUser={setUser} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/items/new" element={user ? <NewItem /> : <Navigate to="/sign-in" />} />
          <Route path="/items/:id" element={<ItemDetail user={user} />} />
          <Route path="/sign-up" element={!user ? <SignUp /> : <Navigate to="/dashboard" />} />
          <Route path="/sign-in" element={!user ? <SignIn setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/sign-in" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
