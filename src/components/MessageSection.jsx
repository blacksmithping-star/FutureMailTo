import React from 'react';

const MessageSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pt-32 px-6 text-center">
      <div className="absolute left-1/6 top-40 text-6xl animate-ping opacity-60">
      💙
      </div>
      <div className="absolute right-1/6 top-40 text-6xl animate-ping opacity-60">
      💙
      </div>
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          Let Loved Ones Know You’re Always with Them.
        </h2>
        <p className="text-xl md:text-2xl text-gray-400 mb-8">
          Future Messages can be letters of love, farewell, joy, or even humor. They can bring smiles and tears. Most of all, they let your loved ones know that even after death, you are always with them.
        </p>
        
        <a href="#letter" 
                className="inline-flex items-center px-8 py-3 text-lg font-medium
                  bg-gradient-to-r from-cyan-400 to-purple-500 
                  hover:from-purple-500 hover:to-cyan-400
                  text-gray-900 rounded-xl transition-all duration-300
                  hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
                  active:scale-95">
                <span className="relative">Get Started</span>
              </a>
      </div>
    </section>
  );
};

export default MessageSection;
