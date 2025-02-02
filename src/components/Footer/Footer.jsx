import React from 'react';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white py-6'>
      <div className='max-w-4xl px-4 mx-auto'>
        <Link to='/'>
          <img src='./logo-white.png' className='w-36 my-2' alt='Logo' />
        </Link>
        <div className='flex justify-center space-x-6 my-4'>
          <a 
            href='https://github.com/danishhansari' 
            target="_blank" 
            rel="noopener noreferrer" 
            className='hover:text-gray-400 transition duration-200'
          >
            GitHub
          </a>
          <a 
            href='https://twitter.com/danish__an' 
            target="_blank" 
            rel="noopener noreferrer" 
            className='hover:text-gray-400 transition duration-200'
          >
            Twitter
          </a>
          <a 
            href='https://linkedin.com/in/danishhansari' 
            target="_blank" 
            rel="noopener noreferrer" 
            className='hover:text-gray-400 transition duration-200'
          >
            LinkedIn
          </a>
        </div>
        <div className='text-center my-4'>
          <a 
            href='https://m.me/your_facebook_username' // Replace with your Facebook Messenger link
            target="_blank" 
            rel="noopener noreferrer" 
            className='inline-flex items-center px-6 py-3 text-lg font-medium
              bg-gradient-to-r from-cyan-400 to-purple-500 
              hover:from-purple-500 hover:to-cyan-400
              text-gray-900 rounded-xl transition-all duration-300
              hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
              active:scale-95'
          >
            Chat with Developer
          </a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer; 