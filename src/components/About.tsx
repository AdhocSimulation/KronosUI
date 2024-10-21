import React from 'react';

interface AboutProps {
  colorMode: 'light' | 'dark';
}

function About({ colorMode }: AboutProps) {
  return (
    <div className={`container mx-auto px-4 py-8 ${colorMode === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      <h1 className="text-4xl font-bold mb-6">About FinApp</h1>
      <p className="text-xl mb-4">
        FinApp is a powerful financial data visualization tool that provides real-time stock information and interactive charts.
      </p>
      <p className="text-xl mb-4">
        Our features include:
      </p>
      <ul className="list-disc list-inside mb-4 text-lg">
        <li>Real-time stock data</li>
        <li>Interactive charts with multiple timeframes</li>
        <li>Technical indicators</li>
        <li>Dark and light mode</li>
      </ul>
      <p className="text-xl">
        Whether you're a professional trader or just getting started with investing, FinApp provides the tools you need to make informed decisions.
      </p>
    </div>
  );
}

export default About;