'use client';
import React from 'react';

function page() {
  const [url, setUrl] = React.useState('');

  const handleSubmit = async () => {
    console.log(url);
    try {
      const response = await fetch('/api/processFile', {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border border-gray-300 rounded-md p-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </div>
  );
}

export default page;
