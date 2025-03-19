import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../../config/firebase'; // Adjust the path as necessary
import { collection, query, where, getDocs, deleteDoc, addDoc } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Link, Navigate } from 'react-router-dom';

function UserProfile() {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReauthModalOpen, setIsReauthModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const isAnony = currentUser ? currentUser.isAnonymous : false;
  const [userCount, setUserCount] = useState(null);
  const [isBirthdayModalOpen, setBirthdayModalOpen] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [nextBirthdayDate, setNextBirthdayDate] = useState(() => {
    return localStorage.getItem(`birthday_${currentUser.email}`) || '';
  });

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const [location, setLocation] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    // Fetch location data using ipgeolocation.io API (Free API)
    fetch('https://api.ipgeolocation.io/ipgeo?apiKey=03476f3cc2e245e2bb03309eda0c8bf5')
      .then(response => response.json())
      .then(data => {
        setLocation(data);
      })
      .catch(error => {
        console.error('Error fetching location:', error);
      });
  }, []);


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

  // const handleDeleteAccount = async () => {
  //   try {
  //     // Re-authenticate the user
  //     const credential = EmailAuthProvider.credential(currentUser.email, password);
  //     await reauthenticateWithCredential(currentUser, credential);

  //     // Fetch all emails associated with the user
  //     const emailsCollection = collection(db, 'emails');
  //     const q = query(emailsCollection, where("from", "==", currentUser.email));
  //     const querySnapshot = await getDocs(q);

  //     // Delete each email
  //     const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  //     await Promise.all(deletePromises);
  //     console.log("All emails deleted successfully.");

  //     // Delete the user account
  //     await deleteUserAccount(); // Call the method to delete the user account
  //     console.log("User account deleted successfully!");

  //     // Optionally, redirect or show a success message
  //   } catch (error) {
  //     console.error("Error deleting account: ", error);
  //     // Optionally, show a toast notification or alert to inform the user
  //   } finally {
  //     setIsModalOpen(false); // Close the modal
  //   }
  // };

  const handleBirthdayWish = async () => {
    if (!birthDate) return;

    try {
      const birthdayDate = new Date(birthDate);
      const currentYear = new Date().getFullYear();
      
      // Set delivery date to the same month and day but next year
      const deliveryDate = new Date(birthdayDate);
      deliveryDate.setFullYear(currentYear + 1);

      const emailData = {
        to: currentUser.email,
        from: 'shahariar.rijon@gmail.com',
        subject: `🎉 Happy Birthday ${currentUser.displayName}! 🎂`,
        body: `Dear ${currentUser.displayName},\n\nWishing you a year filled with bold dreams, 
        unstoppable energy, and endless joy! 
        May you rise higher, shine brighter, and conquer every goal you set. 
        You are an inspiration, and the world is better with you in it. 
        Keep being amazing, keep chasing greatness, and 
        never stop believing in yourself.
        Here's to more success, happiness, 
        and unforgettable adventures ahead! 🚀✨💙`,
        sendAt: new Date(deliveryDate).toISOString(),
        status: 'scheduled',
        username: 'FutureMailTo'
      };

      await addDoc(collection(db, 'emails'), emailData);
      
      // Save to localStorage
      localStorage.setItem(`birthday_${currentUser.email}`, deliveryDate.toISOString());
      setNextBirthdayDate(deliveryDate.toISOString());
      
      setBirthdayModalOpen(false);
    } catch (error) {
      console.error('Error scheduling birthday wish:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-32">
      <div className="max-w-3xl mx-auto px-4">
        {/* <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex flex-col items-center">
            <img
              src={isAnony ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTelZ7W2tOs5kd_GIOw595myZLLf4KBda-Q5w&s" : currentUser.photoURL}
              alt={currentUser.displayName}
              className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-xl"
            />
            <h1 className="mt-6 text-3xl font-bold text-gray-200">
              {isAnony ? "Anonymous User" : currentUser.displayName}
            </h1>
            <p className="mt-2 text-gray-400">
              {isAnony ? currentUser.uid : currentUser.email}
            </p>
            
          </div>
        </div> */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-4">
  <div className="w-full flex flex-col items-center justify-center bg-gray-600 h-24 rounded-xl">
    <p className="text-green-400 flex">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" fill="currentColor" height="20" width="20">
        <path d="M1408 1216q0 26-19 45t-45 19h-896q-26 0-45-19t-19-45 19-45l448-448q19-19 45-19t45 19l448 448q19 19 19 45z"></path>
      </svg> 20%
    </p>

    <h1 className='text-3xl font-bold text-gray-200'>
      {userCount} USERS
    </h1>
  </div>

  <div className="w-full flex flex-row gap-3 items-center justify-center h-24 bg-gray-800 rounded-xl md:col-span-2">
    <img
      src={isAnony ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTelZ7W2tOs5kd_GIOw595myZLLf4KBda-Q5w&s" : currentUser.photoURL}
      alt={currentUser.displayName}
      className="w-20 h-20 rounded-full shadow-xl"
    />
    <h1 className="text-3xl font-bold text-gray-200">
      {isAnony ? "Anonymous User" : currentUser.displayName}
    </h1>
  </div>

  <div className="w-full flex flex-row gap-3 items-center justify-center h-24 bg-gray-800 rounded-xl md:col-span-2">
    <p className="text-xl text-gray-400">
      UID: {isAnony ? currentUser.uid : currentUser.email}
    </p>
  </div>

  <div className="w-full flex flex-row gap-3 items-center justify-center h-24 bg-gray-600 rounded-xl">
    {location ? (
      <div className='flex text-white flex-row gap-3 items-center justify-center'>
        <div>
          <img src={location.country_flag} alt={location.country_name} width="50" />
        </div>
        <p>{location.country_code2}</p>
      </div>
    ) : (
      <p>UNDEFINED</p>
    )}
  </div>
  <div className="w-full flex flex-row gap-3 items-center justify-center h-24 bg-gray-800 rounded-xl">
    {isAnony ? (
      <button
        disabled
        className="inline-flex bg-gray-700 justify-center items-center h-24 w-full px-6 py-3 text-lg font-medium
          text-white rounded-xl transition-all duration-300
          cursor-not-allowed filter blur-[1px] hover:blur-none
          relative group"
      >
        <span className="relative">Sign in to Leave Review 🔒</span>
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 
          flex items-center justify-center">
          <span className="text-white font-medium">Login Required</span>
        </div>
      </button>
    ) : (
      <Link 
        to="/review" 
        className="inline-flex bg-gradient-to-r from-cyan-400 to-purple-500 justify-center items-center h-24 w-full px-6 py-3 text-lg font-medium
          text-white rounded-xl transition-all duration-300
          hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
          active:scale-95"
      >
        <span className="relative">Leave a Review ✍️</span>
      </Link>
    )}
  </div>

  <div className="w-full flex flex-row gap-3 items-center justify-center h-24 bg-gray-600 rounded-xl md:col-span-2">
    <button
      onClick={() => setBirthdayModalOpen(true)}
      disabled={isAnony || (nextBirthdayDate && new Date(nextBirthdayDate) > new Date())}
      className={`inline-flex cursor-pointer w-full h-24 justify-center items-center px-6 py-3 text-lg font-medium
        ${isAnony 
          ? 'bg-gray-700 cursor-not-allowed filter blur-[1px] hover:blur-none transition-all'
          : nextBirthdayDate && new Date(nextBirthdayDate) > new Date()
            ? 'bg-gray-700 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 hover:shadow-[0_0_20px_rgba(219,39,119,0.3)]'
        }
        text-white rounded-xl transition-all duration-300
        active:scale-95 relative group`}
    >
      <span className="relative flex items-center">
        {isAnony 
          ? 'Sign in to Get Birthday Wish 🔒'
          : nextBirthdayDate && new Date(nextBirthdayDate) > new Date()
            ? `Scheduled for ${formatDate(nextBirthdayDate)} 🎂`
            : 'Get a Wish on Birthday 🎂'}
      </span>
      {isAnony && (
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300 
          flex items-center justify-center">
          <span className="text-white font-medium">Login Required</span>
        </div>
      )}
    </button>

    {/* Birthday Modal - only show if user is not anonymous */}
    {!isAnony && isBirthdayModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700">
          <h3 className="text-2xl font-bold text-gray-200 mb-6">
            Get Surprise Birthday Wish
          </h3>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2 text-lg font-medium">
              Your Birthday
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-lg text-gray-300 
                focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleBirthdayWish}
              disabled={!birthDate}
              className="flex-1 inline-flex justify-center items-center px-6 py-3 text-lg font-medium
                bg-gradient-to-r from-pink-500 to-purple-500 
                hover:from-purple-500 hover:to-pink-500
                text-white rounded-xl transition-all duration-300
                hover:shadow-[0_0_20px_rgba(219,39,119,0.3)]
                active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
            <button
              onClick={() => setBirthdayModalOpen(false)}
              className="flex-1 px-6 py-3 text-lg font-medium text-gray-300 
                bg-gray-700 hover:bg-gray-600 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

        <a
          target='_blank'
          href="https://github.com/rijonshahariar/FutureMailTo"
          className="flex mx-auto cursor-pointer mt-5 overflow-hidden items-center text-md font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-800 text-white shadow hover:bg-gray/90 h-10 px-4 py-2 max-w-55 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-1 hover:ring-black hover:ring-offset-2"
        >
          <span
            className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"
          ></span>
          <div className="flex items-center">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 438.549 438.549">
              <path
                d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
              ></path>
            </svg>
            <span className="ml-1 text-white">Star on GitHub</span>
          </div>
          <div className="ml-2 flex items-center gap-1 text-sm md:flex">
            <svg
              className="w-4 h-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300"
              data-slot="icon"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                fillRule="evenodd"
              ></path>
            </svg>
            <span
              className="inline-block tabular-nums tracking-wider font-display font-medium text-white"
            >30</span
            >
          </div>
        </a>

      </div>
    </div>
  );
}

export default UserProfile; 