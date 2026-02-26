import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Genres from './pages/Genres';
import Library from './pages/Library';
import ComingSoon from './pages/ComingSoon';
import WriterProfile from './pages/WriterProfile';

import AdminDashboard from './pages/AdminDashboard';
import Search from './pages/Search';
import CreatePlaylist from './pages/CreatePlaylist';
import PlaylistDetail from './pages/PlaylistDetail';

import Home from './pages/Home';
import { PlayerProvider } from './context/PlayerContext';

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="genres" element={<Genres />} />
            <Route path="library" element={<Library />} />
            <Route path="coming-soon" element={<ComingSoon />} />
            <Route path="writer/:id" element={<WriterProfile />} />
            <Route path="search" element={<Search />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="create-playlist" element={<CreatePlaylist />} />
            <Route path="playlist/:id" element={<PlaylistDetail />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
