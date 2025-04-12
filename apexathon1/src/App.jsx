import { useState } from 'react';
import InputForm from './InputForm';
import Dashboard from './Dashboard';

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleFormSubmit = (profile) => {
    setUserProfile(profile);
    setShowDashboard(true);
  };

  const handleBackToForm = () => {
    setShowDashboard(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {!showDashboard ? (
          <>
            <InputForm onSubmit={handleFormSubmit} />
          </>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-light text-gray-100">Your Career Dashboard</h1>
              <button 
                onClick={handleBackToForm}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Form
              </button>
            </div>
            <Dashboard userProfile={userProfile} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;