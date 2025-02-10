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
            <Link to="/" 
            style={{backgroundColor: '#3ba55d'}}
                className="inline-flex items-center mt-10 px-6 py-3 text-lg font-medium
                  text-white rounded-2xl transition-all duration-300
                  hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
                  active:scale-95">
                <span className="relative">Send Another 👍</span>
              </Link>
              <Link className='mt-3 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]' style={{width:200}} to='https://ko-fi.com/U7U31AD4H4' target='_blank'><img src='https://storage.ko-fi.com/cdn/kofi2.png?v=6' border='0' alt='Buy Me a Coffee at ko-fi.com' /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage; 