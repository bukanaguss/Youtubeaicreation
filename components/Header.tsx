
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 pb-2">
        CineMind AI
      </h1>
      <p className="text-slate-400 mt-2 text-lg">
        Karena setiap ide layak menjadi kisah yang menggetarkan.
      </p>
    </header>
  );
};

export default Header;