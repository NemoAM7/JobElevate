import React, { useState, useEffect } from 'react';

const InputForm = ({ onSubmit }) => {
  const provinces = ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'];
  const cmaOptions = ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa-Gatineau', 'Winnipeg', 'Quebec City', 'Hamilton', 'Halifax'];
  const genderOptions = ['Male', 'Female'];
  const maritalStatusOptions = ['Single', 'Married', 'Common-law', 'Divorced', 'Separated', 'Widowed'];
  const educationOptions = [
    '0 to 8 years',
    'Some high school',
    'High school graduate',
    'Some postsecondary',
    'Postsecondary certificate or diploma',
    'Bachelor\'s degree',
    'Above bachelor\'s degree'
  ];
  const immigrationOptions = [
    'Immigrant, landed 10 or less years earlier',
    'Immigrant, landed more than 10 years earlier',
    'Non-immigrant'
  ];

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : {
      province: '',
      cma: '',
      age: '',
      gender: '',
      maritalStatus: '',
      education: '',
      immigration: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      onSubmit(formData);
      
      localStorage.removeItem('formData');
      
      setFormData({
        province: '',
        cma: '',
        age: '',
        gender: '',
        maritalStatus: '',
        education: '',
        immigration: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-gray-100 mb-2 tracking-wide">Personal Information</h2>
        <p className="text-gray-400 text-sm">Your responses help us serve you better</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="province" className="block text-sm font-light text-gray-300">Where do you live?</label>
            <select
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 hover:border-gray-500"
            >
              <option value="" className="bg-gray-700">Select your province</option>
              {provinces.map(province => (
                <option key={province} value={province} className="bg-gray-700">
                  {province}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="cma" className="block text-sm font-light text-gray-300">Which city area?</label>
            <select
              id="cma"
              name="cma"
              value={formData.cma}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 hover:border-gray-500"
            >
              <option value="" className="bg-gray-700">Select your city area</option>
              {cmaOptions.map(cma => (
                <option key={cma} value={cma} className="bg-gray-700">
                  {cma}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="age" className="block text-sm font-light text-gray-300">How old are you?</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="15"
            max="120"
            required
            className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 hover:border-gray-500"
            placeholder="Enter your age (minimum 15)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="gender" className="block text-sm font-light text-gray-300">What's your gender?</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 hover:border-gray-500"
            >
              <option value="" className="bg-gray-700">Select your gender</option>
              {genderOptions.map(gender => (
                <option key={gender} value={gender} className="bg-gray-700">
                  {gender}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="maritalStatus" className="block text-sm font-light text-gray-300">What's your marital status?</label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 hover:border-gray-500"
            >
              <option value="" className="bg-gray-700">Select your status</option>
              {maritalStatusOptions.map(status => (
                <option key={status} value={status} className="bg-gray-700">
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="education" className="block text-sm font-light text-gray-300">What's your education level?</label>
            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 hover:border-gray-500"
            >
              <option value="" className="bg-gray-700">Select your education</option>
              {educationOptions.map(education => (
                <option key={education} value={education} className="bg-gray-700">
                  {education}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="immigration" className="block text-sm font-light text-gray-300">What's your immigration status?</label>
            <select
              id="immigration"
              name="immigration"
              value={formData.immigration}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 hover:border-gray-500"
            >
              <option value="" className="bg-gray-700">Select your status</option>
              {immigrationOptions.map(status => (
                <option key={status} value={status} className="bg-gray-700">
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600/90 text-white font-light rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Submit Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm; 