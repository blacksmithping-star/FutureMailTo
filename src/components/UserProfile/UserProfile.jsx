import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { db } from '../../config/firebase'; // Adjust the path as necessary
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { Navigate } from 'react-router-dom';

function UserProfile() {
  const { currentUser} = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReauthModalOpen, setIsReauthModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const isAnony = currentUser ? currentUser.isAnonymous : false;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

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

  return (
    <div className="min-h-screen bg-gray-900 pt-32">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
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
            {/* <button
              onClick={() => setIsReauthModalOpen(true)}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition duration-300"
            >
              Delete Account
            </button> */}
          </div>
        </div>
      </div>

      {/* Re-authentication Modal */}
      {isReauthModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Re-authenticate</h2>
            <p>Please enter your password to confirm account deletion.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-2 p-2 border border-gray-300 rounded"
              required
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsReauthModalOpen(false)}
                className="mr-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile; 