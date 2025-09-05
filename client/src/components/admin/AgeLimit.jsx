import React, { useState, useEffect } from 'react';
import CleanNumberInput from './CleanNumberInput'; // Adjust the path if needed

const AgeLimit = ({ onChange }) => {
  const [age, setAge] = useState({
    salaried: {
      min_age: '0',
      max_age: '0',
      extension_age_period: '0'
    },
    self_employed: {
      min_age: '0',
      max_age: '0'
    }
  });

  useEffect(() => {
    onChange && onChange(age);
  }, [age]);

  const handleInputChange = (type, field, value) => {
    setAge((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Age Limit</h3>

      <div className="space-y-4">
        {/* Salaried */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Salaried</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Min Age</label>
              <CleanNumberInput
                value={age.salaried.min_age}
                onChange={(val) => handleInputChange('salaried', 'min_age', val)}
                placeholder="Min Age"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Max Age</label>
              <CleanNumberInput
                value={age.salaried.max_age}
                onChange={(val) => handleInputChange('salaried', 'max_age', val)}
                placeholder="Max Age"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Extension Period</label>
              <CleanNumberInput
                value={age.salaried.extension_age_period}
                onChange={(val) => handleInputChange('salaried', 'extension_age_period', val)}
                placeholder="Extension Period"
              />
            </div>
          </div>
        </div>

        {/* Self Employed */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Self Employed</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Min Age</label>
              <CleanNumberInput
                value={age.self_employed.min_age}
                onChange={(val) => handleInputChange('self_employed', 'min_age', val)}
                placeholder="Min Age"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Max Age</label>
              <CleanNumberInput
                value={age.self_employed.max_age}
                onChange={(val) => handleInputChange('self_employed', 'max_age', val)}
                placeholder="Max Age"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeLimit;
