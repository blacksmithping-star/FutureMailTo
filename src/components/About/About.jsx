import React from 'react';

const About = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-4'>About This Project</h1>
      <p className='text-gray-700 mb-4'>
        This project is a web application designed to help users schedule emails for future delivery. 
        It utilizes Firebase for backend services and SendGrid for sending emails. The application 
        provides a user-friendly interface for managing email communications effectively.
      </p>
      <h2 className='text-2xl font-semibold mb-2'>Developer Information</h2>
      <p className='text-gray-700 mb-4'>
        Developed by Shahariar Rijon, a passionate developer with a keen interest in building 
        efficient and scalable web applications. 
      </p>
      <div className='flex space-x-4'>
        <a 
          href='https://github.com/rijonshahariar' 
          target="_blank" 
          rel="noopener noreferrer" 
          className='text-blue-600 hover:underline'
        >
          GitHub
        </a>
        <a 
          href='https://linkedin.com/in/shahariar-rijon' 
          target="_blank" 
          rel="noopener noreferrer" 
          className='text-blue-600 hover:underline'
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
};

export default About; 