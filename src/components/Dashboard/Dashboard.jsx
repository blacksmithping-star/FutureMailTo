import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

function Dashboard() {
    const { currentUser } = useAuth();
    const [emails, setEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emailToDelete, setEmailToDelete] = useState(null);

    if (!currentUser) {
        return <Navigate to="/login" replace />;
      }

    useEffect(() => {
        const fetchEmails = async () => {
            if (!currentUser) return;

            try {
                const emailsCollection = collection(db, 'emails');
                const q = query(emailsCollection, where("from", "==", currentUser.email)); // Fetch emails sent to the current user
                const querySnapshot = await getDocs(q);
                
                const fetchedEmails = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Sort emails by sendAt in descending order (newest first)
                const sortedEmails = fetchedEmails.sort((a, b) => new Date(b.sendAt) - new Date(a.sendAt));
                setEmails(sortedEmails);
            } catch (error) {
                console.error("Error fetching emails: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmails();
    }, [currentUser]);

    const handleDeleteEmail = async () => {
        if (emailToDelete) {
            try {
                await deleteDoc(doc(db, 'emails', emailToDelete)); // Delete the email from Firestore
                setEmails(emails.filter(email => email.id !== emailToDelete)); // Update local state
                console.log("Email deleted successfully!");
            } catch (error) {
                console.error("Error deleting email: ", error);
            } finally {
                setIsModalOpen(false); // Close the modal
                setEmailToDelete(null); // Reset the email to delete
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 pb-10 pt-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-200">
                        Time Travelling Letters
                    </h1>
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 text-lg font-medium
              bg-gradient-to-r from-cyan-400 to-purple-500 
              hover:from-purple-500 hover:to-cyan-400
              text-gray-900 rounded-xl transition-all duration-300
              hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
              active:scale-95"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Letter
                    </Link>
                </div>

                {/* Messages List */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                ) : emails.length > 0 ? (
                    <div className="flex flex-col space-y-4">
                        {emails.map((email) => (
                            <div
                                key={email.id}
                                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 
                  transition-all duration-300 group relative shadow-lg hover:shadow-xl"
                            >
                                <div className="flex justify-between items-start mb-4 pr-12">
                                    <h3 className="text-xl font-semibold text-gray-200 group-hover:text-purple-400 
                    transition-colors duration-300">
                                        {email.subject}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${email.status === 'scheduled'
                                            ? 'bg-purple-500/10 text-purple-400'
                                            : 'bg-green-500/10 text-green-400'}`}>
                                        {email.status === 'scheduled' ? 'Scheduled' : 'Delivered'}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-2">
                                    Recipient: <span className="text-gray-300">{email.to}</span>
                                </p>
                                <div className="flex items-center text-gray-500 text-sm">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Delivers on {new Date(email.sendAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <button
                                    onClick={() => {
                                        setEmailToDelete(email.id); // Set the email ID to delete
                                        setIsModalOpen(true); // Open the confirmation modal
                                    }}


                                    className="absolute cursor-pointer top-4 right-4 p-2 rounded-lg bg-gray-700/50 

                     transition-all duration-300 hover:bg-red-500/20

                    hover:text-red-400 text-gray-400"

                                    title="Delete letter"

                                >

                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">

                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}

                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"

                                        />

                                    </svg>

                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-4 text-xl font-medium text-gray-200">No letters yet</h3>
                        <p className="mt-2 text-gray-400">Get started by creating your first letter to the future.</p>
                        <Link
                            to="/"
                            className="mt-6 inline-flex items-center px-6 py-3 text-lg font-medium
                bg-gradient-to-r from-cyan-400 to-purple-500 
                hover:from-purple-500 hover:to-cyan-400
                text-gray-900 rounded-xl transition-all duration-300
                hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
                active:scale-95"
                        >
                            Write a letter
                        </Link>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-00">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
                        <p>This action cannot be undone.</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="mr-4 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteEmail}
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

export default Dashboard; 