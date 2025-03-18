import React, { useEffect, useState } from 'react';

const MessageSection = () => {

  const [userCount, setUserCount] = useState(null);
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const apiSecretKey = import.meta.env.VITE_FIREBASE_API_KEY;
        const response = await fetch("https://futuremail-server.vercel.app/api/usercounterserver", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${apiSecretKey}`,
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user count");
        }

        const data = await response.json();
        setUserCount(data.userCount);
      } catch (err) {
        throw new Error("Failed to fetch user count");
      } finally {
      }
    };

    fetchUserCount();
  }, []);
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


        <div
          className="group mx-auto mb-10 relative flex w-full flex-col rounded-3xl bg-white-950 p-5 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20"
        >
          <div
            className="absolute rounded-3xl bg-gradient-to-r from-cyan-400 to-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30"
          ></div>
          <div className="absolute inset-px rounded-3xl bg-gray-800"></div>

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500"
                >
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg text-white">FutureMailTo Analytics</h3>
              </div>

              <span
                className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Live
              </span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-900/50 p-3">
                <p className="text-md font-medium text-slate-400">Total Users</p>
                <p className="text-3xl font-semibold text-white">{userCount}</p>
                <span className="text-xs font-medium text-emerald-500">+40.3%</span>
              </div>

              <div className="rounded-lg bg-slate-900/50 p-3">
                <p className="text-md font-medium text-slate-400">Scheduled Email</p>
                <p className="text-3xl font-semibold text-white">{userCount + 15}+</p>
                <span className="text-xs font-medium text-emerald-500">+40.1%</span>
              </div>
            </div>

            <div
              className="mb-4 h-24 w-full overflow-hidden rounded-lg bg-slate-900/50 p-3"
            >
              <div className="flex h-full w-full items-end justify-between gap-1">
                <div className="h-[40%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[60%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[60%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[40%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[75%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[80%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[60%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[40%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[75%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[80%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[75%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[80%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[45%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[50%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[60%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[40%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[80%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[90%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[85%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[90%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[75%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[80%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[75%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[80%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[65%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[70%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[75%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[80%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[45%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[60%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
                <div className="h-[95%] w-3 rounded-sm bg-indigo-500/30">
                  <div
                    className="h-[85%] w-full rounded-sm bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>


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
