import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  colorMode: 'light' | 'dark';
}

function Login({ colorMode }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (success) {
      navigate('/chart');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${colorMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-4xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-3 py-2 rounded ${colorMode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 rounded ${colorMode === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded ${
            colorMode === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-semibold`}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;