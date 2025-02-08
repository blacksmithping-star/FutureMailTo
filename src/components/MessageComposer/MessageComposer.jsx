import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MessageComposer() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSecondStep, setIsSecondStep] = useState(false);

  const defaultSubject = `An email from ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`;

  // Check for saved form data from location.state or sessionStorage
  const storedFormData = sessionStorage.getItem('formData');
  const parsedFormData = storedFormData ? JSON.parse(storedFormData) : null;
  const savedFormData = location.state?.formData || parsedFormData || {
    email: '',
    subject: defaultSubject,
    message: '',
    selectedDate: 'tomorrow',
    customDate: { month: '', day: '', year: '' }
  };

  // useEffect(() => {
  //   if (!currentUser) {
  //     sessionStorage.removeItem('formData');
  //   }
  // }, [currentUser]);

  const [email, setEmail] = useState(savedFormData.email);
  const [subject, setSubject] = useState(savedFormData.subject);
  const [message, setMessage] = useState(savedFormData.message);
  const [selectedDate, setSelectedDate] = useState(savedFormData.selectedDate);
  const [customDate, setCustomDate] = useState(savedFormData.customDate);
  const isAnony = currentUser ? currentUser.isAnonymous : false;
  const [isUserGhost, setIsUserGhost] = useState(false);

  // Calculate minimum and maximum dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 10);

  // Generate years array (from next year to 10 years ahead)
  const years = Array.from({ length: 11 }, (_, i) => tomorrow.getFullYear() + i);

  // Generate months array
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Generate days array based on selected month and year
  const getDaysInMonth = (month, year) => {
    if (!month) return Array.from({ length: 31 }, (_, i) => i + 1); // Show all possible days if no month selected
    const numMonth = Number(month);
    const numYear = year ? Number(year) : new Date().getFullYear();
    return Array.from({ length: new Date(numYear, numMonth, 0).getDate() }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(customDate.month, customDate.year);

  // Handle custom date changes
  const handleDateChange = (field, value) => {
    const numValue = value === '' ? '' : Number(value);
    const newDate = { ...customDate, [field]: numValue };

    // Only validate day if month is selected
    if (field === 'month' || field === 'year') {
      const daysInMonth = getDaysInMonth(newDate.month, newDate.year);
      if (newDate.day && newDate.day > daysInMonth.length) {
        newDate.day = '';
      }
    }

    setCustomDate(newDate);
  };

  const deliveryOptions = [
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: '7days', label: '7 Days' },
    { id: '21days', label: '21 Days' },
    { id: '1month', label: '1 Month' },
    { id: '3months', label: '3 Months' },
    { id: '6months', label: '6 Months' },
    { id: 'custom', label: 'Custom Date' }
  ];

  // Calculate delivery date based on selection
  const getDeliveryDate = () => {
    if (selectedDate === 'custom') {
      if (customDate.month && customDate.day && customDate.year) {
        const date = new Date(customDate.year, customDate.month - 1, customDate.day);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      return 'Select a complete date';
    }

    const date = new Date();
    switch (selectedDate) {
      case 'tomorrow':
        date.setDate(date.getDate() + 1);
        break;
      case '7days':
        date.setDate(date.getDate() + 7);
        break;
      case '21days':
        date.setDate(date.getDate() + 21);
        break;
      case '1month':
        date.setMonth(date.getMonth() + 1);
        break;
      case '3months':
        date.setMonth(date.getMonth() + 3);
        break;
      case '6months':
        date.setMonth(date.getMonth() + 6);
        break;
      default:
        return 'Select a date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('formData') !== null) {
      setIsSecondStep(true);
    }
  }, [location.state]);


  const handleSendToFuture = async () => {
    setIsLoading(true);
    const today = new Date();
    const todayDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
    const deliveryDate = new Date(getDeliveryDate()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });

    if (todayDate === deliveryDate) {
      toast.error("Please select a date other than today.", {
        style: { backgroundColor: '#1f2937', color: '#ffffff' },
      });
      setIsLoading(false);
      return;
    }


    if (!email || !subject || !message || !selectedDate) {
      toast.error("Please fill in all fields.", {
        style: { backgroundColor: '#1f2937', color: '#ffffff' },
      });
      setIsLoading(false);
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.", {
        style: { backgroundColor: '#1f2937', color: '#ffffff' },
      });
      setIsLoading(false);
      return;
    }

    if (!currentUser) {
      // Save current form state to sessionStorage and redirect to login
      const formData = { email, subject, message, selectedDate, customDate };
      sessionStorage.setItem('formData', JSON.stringify(formData));

      navigate('/login', {
        state: {
          from: location.pathname,
        }
      });
      setIsLoading(false);
      return;
    }

    // Prepare the email data
    const emailData = {
      to: email,
      from: isAnony ? currentUser.uid : currentUser.email,
      username: isAnony || isUserGhost ? "Anonymous User" : currentUser.displayName,
      subject: subject,
      body: message,
      status: "scheduled",
      sendAt: new Date(getDeliveryDate()).toISOString()
    };

    try {
      const emailsCollection = collection(db, 'emails');
      await addDoc(emailsCollection, emailData);

      // Clear the form fields
      setEmail('');
      setSubject(defaultSubject);
      setMessage('');
      setSelectedDate('tomorrow');
      setCustomDate({ month: '', day: '', year: '' });
      setIsLoading(false);
      window.scrollTo(0, 0);
      navigate('/success');
      sessionStorage.removeItem('formData');
    } catch (error) {
      console.error("Error storing email: ", error);
      toast.error("Error in Spaceship. Please try again.", {
        style: { backgroundColor: '#1f2937', color: '#ffffff' },
      });
      setIsLoading(false);
    }
  };

  return (
    <div id='letter' className="relative max-w-5xl mx-auto px-4">
      <ToastContainer position="bottom-right" />
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Write Letter to Future
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl">
          <b>Write.</b> Pick a receiving date. <b>Send.</b> That's It.
        </p>
      </div>

      <div className="card relative bg-gray-800 mb-10 rounded-3xl p-10 shadow-xl border border-gray-800">
        <form className='z-1' onSubmit={(e) => { e.preventDefault(); isSecondStep ? handleSendToFuture() : setIsSecondStep(true); }}>
          {/* Step 1: Email, Subject, and Message */}
          {!isSecondStep && (
            <>
              {/* Email Input */}
              <div className="mb-8">
                <label htmlFor="email" className="block text-gray-300 mb-3 text-lg font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-lg text-gray-300 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300
                         placeholder-gray-500"
                  placeholder="To whom you want to send the letter"
                />
              </div>

              {/* Subject Input */}
              <div className="mb-8">
                <label htmlFor="subject" className="block text-gray-300 mb-3 text-lg font-medium">
                  Subject
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-lg text-gray-300 
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300
                           placeholder-gray-500"
                    placeholder="Enter email subject"
                  />
                  {subject !== defaultSubject && (
                    <button
                      onClick={(e) => { e.preventDefault(); setSubject(defaultSubject); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200
                               p-2 rounded-lg hover:bg-gray-800 transition-all duration-300"
                      title="Reset to default subject"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Message Textarea */}
              <div className="mb-8">
                <label htmlFor="message" className="block text-gray-300 mb-3 text-lg font-medium">
                  Write Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="6"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-lg text-gray-300 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300
                         placeholder-gray-500 resize-none"
                  placeholder="Dear Senorita..."
                />
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation pattern
                  if (!email || !subject || !message || !emailPattern.test(email)) {
                    toast.error("Please fill in all fields.", {
                      style: { backgroundColor: '#1f2937', color: '#ffffff' },
                    });
                  } else {
                    setIsSecondStep(true);
                    window.scrollTo(0, 0);
                  }
                }}
                className="w-full group cursor-pointer relative inline-flex items-center justify-center px-8 py-5 text-xl font-medium
                       bg-gradient-to-r from-cyan-400 to-purple-500 
                       hover:from-purple-500 hover:to-cyan-400
                       text-gray-900 rounded-xl transition-all duration-300
                       hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]
                       active:scale-95"
              >
                <span className="relative">Next Step</span>
                <svg className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </>
          )}

          {/* Step 2: Delivery Options and Date Selection */}
          {isSecondStep && (
            <>
              {/* Back Button */}
              <button
                type="button"
                onClick={() => setIsSecondStep(false)}
                className="mb-4 group cursor-pointer relative inline-flex items-center justify-center px-4 py-2 text-lg font-medium
                       bg-gray-600 text-white rounded-xl transition-all duration-300
                       hover:bg-gray-500 active:scale-95"
              >
                Back
              </button>

              {/* Delivery Options */}
              <div className="mb-10">
                <h3 className="text-gray-300 mb-5 text-lg font-medium">Deliver in</h3>
                <div className="flex flex-wrap gap-4 mb-6">
                  {deliveryOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedDate(option.id);
                        if (option.id !== 'custom') {
                          setCustomDate({ month: '', day: '', year: '' });
                        }
                      }}
                      className={`px-4 cursor-pointer py-3 rounded-lg text-md md:text-lg font-medium transition-all duration-300
                          ${selectedDate === option.id
                          ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-gray-900'
                          : 'bg-gray-900 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Custom Date Dropdowns */}
                {selectedDate === 'custom' && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Month Select */}
                    <select
                      value={customDate.month}
                      onChange={(e) => handleDateChange('month', e.target.value)}
                      className="bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-lg text-gray-300 
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300
                             appearance-none cursor-pointer hover:bg-gray-800"
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>

                    {/* Day Select */}
                    <select
                      value={customDate.day}
                      onChange={(e) => handleDateChange('day', e.target.value)}
                      className="bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-lg text-gray-300 
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300
                             appearance-none cursor-pointer hover:bg-gray-800"
                    >
                      <option value="">Day</option>
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>

                    {/* Year Select */}
                    <select
                      value={customDate.year}
                      onChange={(e) => handleDateChange('year', e.target.value)}
                      className="bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-lg text-gray-300 
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300
                             appearance-none cursor-pointer hover:bg-gray-800"
                    >
                      <option value="">Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Delivery Date Display */}
              <div className="mb-10 p-6 bg-gray-900 rounded-xl border border-gray-700">
                <div className="flex items-center text-gray-300">
                  <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-lg">
                    Delivery Date: {getDeliveryDate()}
                  </span>
                </div>
              </div>

              {currentUser && !isAnony ? (
                <div className="flex items-center mb-10 space-x-2">
                  <button
                    onClick={(e) => { e.preventDefault(); setIsUserGhost(!isUserGhost) }}
                    className={`relative w-12 h-6 flex items-center rounded-full transition duration-300 ${isUserGhost ? "bg-gray-600" : "bg-gray-400"}`}
                  >
                    <div
                      className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${isUserGhost ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                  <span className="text-white text-lg">{isUserGhost ? "Send Anonymously" : `Send as ${currentUser?.displayName}`}</span>
                </div>
              ) : (<></>)}

              {/* Send Button */}
              <button
                type="submit"
                className="w-full group cursor-pointer relative inline-flex items-center justify-center px-8 py-5 text-xl font-medium
                       bg-gradient-to-r from-cyan-400 to-purple-500 
                       hover:from-purple-500 hover:to-cyan-400
                       text-gray-900 rounded-xl transition-all duration-300
                       hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]
                       active:scale-95"
              >
                <span className="relative">Send to the Future</span>
                {isLoading ? (
                  <svg className="animate-spin ml-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default MessageComposer;
