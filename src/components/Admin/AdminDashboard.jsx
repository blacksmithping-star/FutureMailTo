import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, getDocs, getDoc, deleteDoc, doc } from 'firebase/firestore';

function AdminDashboard() {
  const { currentUser } = useAuth();
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);
  const [showDelivered, setShowDelivered] = useState(false);
  const [lastTime, setLastTime] = useState(null);

  // Calculate emails due today and tomorrow
  const countDueToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return emails.filter(email => {
      if (email.status !== 'scheduled') return false;
      const sendDate = new Date(email.sendAt);
      sendDate.setHours(0, 0, 0, 0);
      return sendDate >= today && sendDate < tomorrow;
    }).length;
  }, [emails]);

  const countDueTomorrow = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    return emails.filter(email => {
      if (email.status !== 'scheduled') return false;
      const sendDate = new Date(email.sendAt);
      sendDate.setHours(0, 0, 0, 0);
      return sendDate >= tomorrow && sendDate < dayAfterTomorrow;
    }).length;
  }, [emails]);

  // Filter emails based on showDelivered state
  const filteredEmails = useMemo(() => {
    return emails.filter(email => showDelivered || email.status !== 'sent');
  }, [emails, showDelivered]);

  const deliveredCount = useMemo(() => {
    return emails.filter(email => email.status === 'sent').length;
  }, [emails]);

  // Check if the current user is an admin by looking up a document
  // in the "admin" collection with the same UID.
  useEffect(() => {
    async function checkAdminStatus() {
      if (currentUser) {
        try {
          const adminDocRef = doc(db, 'admin', currentUser.uid);
          const adminDocSnap = await getDoc(adminDocRef);
          // If the document exists, mark the user as an admin.
          setIsAdmin(adminDocSnap.exists());
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } finally {
          setIsCheckingAdmin(false);
        }
      } else {
        // No currentUser—finish checking.
        setIsCheckingAdmin(false);
      }
    }
    checkAdminStatus();
  }, [currentUser]);

  // Fetch emails only if the user is an admin.
  useEffect(() => {
    async function fetchEmails() {
      try {
        const emailsCollection = collection(db, 'emails');
        const querySnapshot = await getDocs(emailsCollection);
        const fetchedEmails = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        // Sort emails by sendAt (newest first).
        const sortedEmails = fetchedEmails.sort(
          (a, b) => new Date(a.sendAt) - new Date(b.sendAt)
        );
        setEmails(sortedEmails);

        // server time check
        const serverTimeRef = doc(db, "server", "serverTime");
        const serverTimeSnap = await getDoc(serverTimeRef);
        if (serverTimeSnap.exists()) {
          setLastTime(serverTimeSnap.data().lastUpdated.toDate());
        } else {
          setLastTime(null);
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAdmin) {
      fetchEmails();
    } else {
      setIsLoading(false);
    }
  }, [isAdmin]);

  // Function to delete an email.
  const handleDeleteEmail = async () => {
    if (emailToDelete) {
      try {
        await deleteDoc(doc(db, 'emails', emailToDelete));
        setEmails(emails.filter((email) => email.id !== emailToDelete));
      } catch (error) {
        console.error('Error deleting email:', error);
      } finally {
        setIsModalOpen(false);
        setEmailToDelete(null);
      }
    }
  };

  // Conditionally render based on user authentication and admin status.
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the admin dashboard if the user is an admin.
  return (
    <div className="min-h-screen bg-gray-900 pb-10 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-200">
            Stats
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDelivered(!showDelivered)}
              className="inline-flex cursor-pointer items-center px-3 py-3 text-lg font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              {showDelivered ? 'Hide Delivered' : 'Show Delivered'}
            </button>
            {/* <Link
              to="/"
              className="inline-flex items-center px-3 py-3 text-lg font-medium bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-purple-500 hover:to-cyan-400 text-gray-900 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-95"
            >
              Home
            </Link> */}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <div className="grid md:grid-cols-4 grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-purple-400">{countDueToday}</span>
              <span className="text-gray-300">Due Today</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-cyan-400">{countDueTomorrow}</span>
              <span className="text-gray-300">Due Tomorrow</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-green-400">{deliveredCount}</span>
              <span className="text-gray-300">Delivered</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-purple-400">{emails.length}</span>
              <span className="text-gray-300">Scheduled</span>
            </div>
          </div>
        </div>

        <div className="text-center md:text-right mb-8">
          <p className="text-md font-bold text-cyan-200">Last Server Time: <span className="text-md font-medium text-gray-300">{lastTime ? 
          <span>{lastServerTime.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}</span> : 'Not Available'}</span></p>
          
        </div>

        {/* Emails List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredEmails.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 group relative shadow-lg hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-4 pr-12">
                  {/* <h3 className="text-xl font-semibold text-gray-200 group-hover:text-purple-400 transition-colors duration-300">
                    {email.subject}
                  </h3> */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${email.status === 'scheduled'
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'bg-green-500/10 text-green-400'
                      }`}
                  >
                    {email.status === 'scheduled' ? 'Scheduled' : 'Delivered'}
                  </span>
                </div>
                {/* <p className="text-gray-500 text-sm mb-2">
                  <span className="text-gray-300">{email.body}</span>
                </p> */}
                <p className="text-gray-500 text-sm mb-2">
                  To: <span className="text-gray-300">{email.to}</span> || From: <span className="text-gray-300">{email.from}</span>
                </p>
                <div className="flex items-center text-gray-500 text-sm">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Delivers on{' '}
                  {new Date(email.sendAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}{' || '}{email.sendAt}
                </div>
                <button
                  onClick={() => {
                    setEmailToDelete(email.id);
                    setIsModalOpen(true);
                  }}
                  className="absolute cursor-pointer top-4 right-4 p-2 rounded-lg bg-gray-700/50 transition-all duration-300 hover:bg-red-500/20 hover:text-red-400 text-gray-400"
                  title="Delete letter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-200">
              No letters found
            </h3>
            <p className="mt-2 text-gray-400">
              There are currently no letters available.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-00">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              Deleting this message will cancel the process.
            </h2>
            <p>Are you sure?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-4 cursor-pointer px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEmail}
                className="px-4 cursor-pointer py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
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

export default AdminDashboard;
