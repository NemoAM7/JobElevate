import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';

const Dashboard = ({ userProfile }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourses, setShowCourses] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showListings, setShowListings] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I can help you with career advice and job search guidance. How can I assist you today?' }
  ]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfileData', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const getUserProfileData = () => {
    if (userProfile) {
      return userProfile;
    }
    
    const storedData = localStorage.getItem('userProfileData');
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    return {};
  };

  const generateJobs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/llm/predict-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "prov": 1,
          "cma": 2,
          "age_12": 3,
          "gender": 1,
          "marstat": 2,
          "educ": 3
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      
      const jobData = await response.json();
      
      const formattedJobs = jobData.map((job, index) => ({
        id: index + 1,
        title: job,
        relevanceScore: (90 - index * 5) 
      }));
      
      return formattedJobs;
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      
      return [
        { id: 1, title: 'Software Developer', relevanceScore: 85 },
        { id: 2, title: 'Data Analyst', relevanceScore: 80 },
        { id: 3, title: 'Project Manager', relevanceScore: 75 }
      ];
    }
  };

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setJobs([]);
        setLoading(true);
        
        const allJobs = await generateJobs();
        
        if (allJobs.length > 0) {
          // Display jobs one by one with animation
          for (let i = 0; i < allJobs.length; i++) {
            setTimeout(() => {
              // Only add the current job at index i
              setJobs(currentJobs => {
                const jobExists = currentJobs.some(job => job.id === allJobs[i].id);
                // Only add if job doesn't already exist
                if (!jobExists) {
                  return [...currentJobs, allJobs[i]];
                }
                return currentJobs;
              });
              
              if (i === allJobs.length - 1) {
                setLoading(false);
              }
            }, i * 800);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
        setLoading(false);
      }
    };
    
    // Call the async function
    loadJobs();
    
    // No dependencies needed as we only want to load once on mount
  }, []);

  const handleViewCourses = (job) => {
    setSelectedJob(job);
    setShowCourses(true);
  };

  const handleViewListings = (job) => {
    setSelectedJob(job);
    setShowListings(true);
    setShowCourses(false);
  };

  const handleCloseModal = () => {
    setShowCourses(false);
    setShowListings(false);
    setShowChatbot(false);
    setSelectedJob(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const currentInput = userInput;
    
    setChatMessages(prev => [...prev, { role: 'user', content: currentInput }]);
    
    setUserInput('');
    
    const loadingMsgIndex = chatMessages.length + 1;
    setChatMessages(prev => [...prev, { role: 'assistant', content: 'Thinking...', isLoading: true }]);
    
    try {
      // Get user profile data
      const profileData = getUserProfileData();
      
      // Create enhanced prompt with user profile context
      const enhancedPrompt = `
User Profile:
- Name: ${profileData.name || 'Not provided'}
- Education: ${profileData.education || 'Not provided'}
- Immigration Status: ${profileData.immigration || 'Not provided'}
- Skills: ${profileData.skills || 'Not provided'}
- Experience: ${profileData.experience || 'Not provided'}

User Question: ${currentInput}
`;
      
      const response = await fetch('http://localhost:8000/api/llm/prompt/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          model_name: "llama-3.2-90b-vision-preview"
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }
      
      let responseText = await response.text();
      
      // Clean up the response string if needed
      try {
        // Check if the response is a JSON string with quotes
        if (responseText.startsWith('"') && responseText.endsWith('"')) {
          // Parse the JSON string
          responseText = JSON.parse(responseText);
        }
        
        // Replace literal "\n" with actual line breaks if they exist
        responseText = responseText.replace(/\\n/g, '\n');
      } catch (parseError) {
        console.warn('Error parsing response:', parseError);
        // Continue with the original response if parsing fails
      }
      
      setChatMessages(prev => [
        ...prev.slice(0, prev.length - 1),
        { role: 'assistant', content: responseText }
      ]);
    } catch (error) {
      console.error('Error calling LLM API:', error);
      
      setChatMessages(prev => [
        ...prev.slice(0, prev.length - 1),
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-100 mb-2">Your Personalized Job Dashboard</h1>
        <p className="text-gray-400">Occupation of professionalsadd with similar background as you.</p>
      </div>
      
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-300">Finding the best opportunities for you...</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            onViewCourses={() => handleViewCourses(job)}
            onViewListings={() => handleViewListings(job)}
          />
        ))}
      </div>
      
      {/* Courses Modal */}
      {showCourses && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-light text-gray-100">Recommended Courses for {selectedJob.title}</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'Introduction to ' + selectedJob.title, provider: 'Coursera', duration: '8 weeks', level: 'Beginner' },
                { title: 'Advanced ' + selectedJob.title + ' Techniques', provider: 'Udemy', duration: '12 weeks', level: 'Intermediate' },
                { title: selectedJob.title + ' Certification', provider: 'LinkedIn Learning', duration: '16 weeks', level: 'Advanced' },
                { title: 'Industry Best Practices for ' + selectedJob.title, provider: 'edX', duration: '6 weeks', level: 'All Levels' },
                { title: 'Specialized ' + selectedJob.title + ' Skills', provider: 'Pluralsight', duration: '10 weeks', level: 'Intermediate' }
              ].map((course, index) => (
                <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
                  <h3 className="text-lg font-medium text-gray-100 mb-1">{course.title}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                    <span className="bg-gray-600/50 px-2 py-1 rounded">{course.provider}</span>
                    <span className="bg-gray-600/50 px-2 py-1 rounded">{course.duration}</span>
                    <span className="bg-gray-600/50 px-2 py-1 rounded">{course.level}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Job Listings Modal */}
      {showListings && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-light text-gray-100">Job Listings for {selectedJob.title}</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { company: 'TechCorp', location: 'Toronto, ON', salary: '$80,000 - $100,000', posted: '2 days ago' },
                { company: 'InnovateCo', location: 'Vancouver, BC', salary: '$85,000 - $110,000', posted: '1 week ago' },
                { company: 'DataFlow', location: 'Montreal, QC', salary: '$75,000 - $95,000', posted: '3 days ago' },
                { company: 'DesignHub', location: 'Calgary, AB', salary: '$70,000 - $90,000', posted: '5 days ago' },
                { company: 'MarketPro', location: 'Ottawa, ON', salary: '$65,000 - $85,000', posted: '1 day ago' }
              ].map((listing, index) => (
                <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-100">{listing.company}</h3>
                    <span className="text-gray-400 text-sm">{listing.posted}</span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {listing.location}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {listing.salary}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Button */}
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-light text-gray-100">Career Assistant</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center">
                        <span>{message.content}</span>
                        <span className="ml-2 animate-pulse">...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {message.content.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < message.content.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 