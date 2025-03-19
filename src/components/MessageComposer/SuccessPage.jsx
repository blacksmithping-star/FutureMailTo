import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

function SuccessPage() {
  const { currentUser} = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-40">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-4 border-gray-700">
          <div className="flex flex-col items-center">
            <img 
              src="https://media.tenor.com/WsmiS-hUZkEAAAAj/verify.gif"
              alt=""
              className="w-32 h-32 rounded-full center"
            />
            <div className='flex flex-col md:flex-row items-center justify-center gap-3'>
            <Link to="/" 
            style={{backgroundColor: '#3ba55d'}}
                className="inline-flex items-center mt-10 px-6 py-3 text-lg font-medium
                  text-white rounded-2xl transition-all duration-300
                  hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
                  active:scale-95">
                <span className="relative">Send Another 👍</span>
              </Link>
              <Link to="/review" 
                className="inline-flex bg-gradient-to-r from-cyan-400 to-purple-500 items-center md:mt-10 px-6 py-3 text-lg font-medium
                  text-white rounded-2xl transition-all duration-300
                  hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
                  active:scale-95">
                       <span className="relative inline-flex items-center gap-2">Leave a Review <svg fill="white" width="20px" height="20px" viewBox="-0.5 -0.5 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" class="jam jam-write-f"><path d='M21.289.98l.59.59c.813.814.69 2.257-.277 3.223L9.435 16.96l-3.942 1.442c-.495.182-.977-.054-1.075-.525a.928.928 0 0 1 .045-.51l1.47-3.976L18.066 1.257c.967-.966 2.41-1.09 3.223-.276zM8.904 2.19a1 1 0 1 1 0 2h-4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a1 1 0 0 1 2 0v4a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4v-12a4 4 0 0 1 4-4h4z' /></svg></span>

              </Link>
            </div>
              
              <Link className='mt-3 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]' style={{width:200}} to='https://ko-fi.com/U7U31AD4H4' target='_blank'><img src='https://storage.ko-fi.com/cdn/kofi2.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage; 