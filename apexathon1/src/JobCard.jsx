import React from 'react';

const JobCard = ({ job, onViewCourses, onViewListings }) => {
  const getRelevanceColor = (score) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400';
    if (score >= 60) return 'bg-blue-500/20 text-blue-400';
    if (score >= 40) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-600/50">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-medium text-gray-100">{job.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(job.relevanceScore)}`}>
            {job.relevanceScore}% Match
          </span>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-300 text-sm">Based on your profile and experience</p>
        </div>
        
        <div className="space-y-2">
          <button 
            onClick={onViewListings}
            className="w-full py-2 px-3 bg-purple-600/80 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            View Job Listings
          </button>
          
          <button 
            onClick={onViewCourses}
            className="w-full py-2 px-3 bg-blue-600/80 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Recommended Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard; 