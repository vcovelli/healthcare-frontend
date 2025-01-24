import React from "react";

const Header = ({ title }) => {
  return (
    <header className="bg-gray-100 py-5 shadow-md">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
