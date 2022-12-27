import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import E404 from './pages/E404';
import News from './pages/News';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="news/public" element={<News authorization="public" />} />
        <Route path="news/private" element={<News authorization="private" />} />
        <Route path="news/admin" element={<News authorization="admin" />} />

        <Route path="/404" element={<E404/>} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
