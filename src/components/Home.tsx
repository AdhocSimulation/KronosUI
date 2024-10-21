import React from 'react';
import { Link } from 'react-router-dom';

interface HomeProps {
  colorMode: 'light' | 'dark';
}

function Home({ colorMode }: HomeProps) {
  return (
    <div className={`container mx-auto px-4 py-8 ${colorMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-4xl font-bold mb-6">Welcome to FinApp</h1>
      <p className="text-xl mb-8">
        Explore financial data and charts with our advanced tools.
      </p>
      <Link
        to="/chart"
        className={`inline-block px-6 py-3 rounded-lg ${
          colorMode === 'dark'
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white font-semibold transition duration-300`}
      >
        View Financial Chart
      </Link>
    </div>
  );
}

export default Home;