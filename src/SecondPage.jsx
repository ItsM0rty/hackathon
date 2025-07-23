import React from 'react';

export default function SecondPage({ onBack }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-3xl font-bold mb-4">Second Page</h1>
      <p className="mb-8">This is a placeholder for the second page.</p>
      <button className="btn btn-primary" onClick={onBack}>Go Back</button>
    </div>
  );
} 