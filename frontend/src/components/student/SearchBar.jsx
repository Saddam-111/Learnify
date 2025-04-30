import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");

  const onSearchHandler = (e) => {
    e.preventDefault();
    // Ensure the URL format is correct
    if (input) {
      navigate(`/course-list/${input}`);
    } else {
      navigate('/course-list'); // If no input, navigate to base course list
    }
  };

  return (
    <form onSubmit={onSearchHandler} className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded'>
      <img src={assets.search_icon} alt="search-icon" className='md:w-auto w-10 px-3' />
      <input
        onChange={e => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder='Search for courses'
        className='w-full h-full outline-none text-gray-500/80'
      />
      <button className="bg-gradient-to-r from-pink-400 via-white to-blue-400 
  hover:bg-gradient-to-b rounded-2xl font-bold text-black md:px-10 px-7 md:py-3 py-2 mx-1 hover:cursor-pointer">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
