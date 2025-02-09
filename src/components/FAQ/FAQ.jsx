import { useState } from 'react';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does FutureMailTo work?",
      answer: "FutureMailTo securely stores your message and delivers it to your specified email address on your chosen future date. Your message is encrypted and can't be accessed by anyone until the delivery date."
    },
    {
      question: "What should I write in the email?",
      answer: "You can write about your current goals, predictions, words of encouragement, or reflections. Common topics include career aspirations, personal growth goals, messages to your loving ones about current events, or reminders of how you're feeling right now."
    },
    {
      question: "Is my message private and secure?",
      answer: "Yes! All messages are encrypted end-to-end and stored securely. Only you (via your email) will be able to read your message when it's delivered. We never share your data with third parties."
    },
    {
      question: "Why write to future?",
      answer: "Writing to future is a powerful tool for personal growth, self-reflection, and motivation. It helps you track your progress, remember important moments, and stay accountable to your goals."
    },
    {
      question: "Can I edit or delete my message after sending?",
      answer: "For authenticity purposes, once a message is sent, it cannot be edited. However, you can cancel the delivery at any time before the scheduled date through your dashboard."
    },
    {
      question: "What if my email address changes?",
      answer: "You cannot update your delivery email address at this moment. We recommend using an email address you plan to keep long-term."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-32 bg-gray-900">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-xl">
            Everything you need to know about sending messages to your future self
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500/50 
                transition-all duration-300 group cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="p-8 flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-200 group-hover:text-transparent 
                  group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 
                  group-hover:bg-clip-text transition-all duration-300">
                  {faq.question}
                </h3>
                <svg 
                  className={`w-8 h-8 text-gray-400 transform transition-transform duration-300
                    ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </div>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out
                  ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="px-8 pb-8 text-gray-400 text-lg leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center p-2 bg-gray-800 rounded-xl">
            <span className="text-gray-400 px-6 text-lg">Still have questions?</span>
            <a 
              href="https://m.me/shahariar.rijon.wd" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 text-lg font-medium
                bg-gradient-to-r from-cyan-400 to-purple-500 
                hover:from-purple-500 hover:to-cyan-400
                text-gray-900 rounded-lg transition-all duration-300
                hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]
                active:scale-95"
            >
              Chat With Developer
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ; 