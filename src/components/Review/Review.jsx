import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

function Review() {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !review.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all fields'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      await addDoc(collection(db, 'reviews'), {
        name: name.trim(),
        review: review.trim(),
        userId: currentUser?.uid || 'anonymous',
        createdAt: new Date(),
      });

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your review!'
      });
      setName('');
      setReview('');
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit review. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-32">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Share Your Experience
          </h1>
          <p className="text-gray-400 text-lg">
            Let us know what you think about FutureMailTo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
          {/* Name Input */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-300 mb-2 text-lg font-medium">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-lg text-gray-300 
                focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300
                placeholder-gray-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Review Textarea */}
          <div className="mb-6">
            <label htmlFor="review" className="block text-gray-300 mb-2 text-lg font-medium">
              Your Review
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="6"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-lg text-gray-300 
                focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300
                placeholder-gray-500 resize-none"
              placeholder="Share your thoughts..."
            />
          </div>

          {/* Status Message */}
          {submitStatus.message && (
            <div className={`mb-6 p-4 rounded-lg ${
              submitStatus.type === 'error' 
                ? 'bg-red-500/10 text-red-400' 
                : 'bg-green-500/10 text-green-400'
            }`}>
              {submitStatus.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium
              bg-gradient-to-r from-cyan-400 to-purple-500 
              hover:from-purple-500 hover:to-cyan-400
              text-gray-900 rounded-xl transition-all duration-300
              hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]
              active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Submit Review'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Review; 