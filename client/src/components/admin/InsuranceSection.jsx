import React, { useState, useEffect } from 'react';

const InsuranceSection = ({ onChange }) => {
  const [insurance, setInsurance] = useState({
    life_insurance: {
      mandatory: false,
      full: false,
      less_tensor: false,
      lumsum: false
    },
    property_insurance: {
      mandatory: false,
      full: false,
      less_tensor: false,
      lumsum: false
    },
    health_insurance: {
      mandatory: false,
      full: false,
      less_tensor: false,
      lumsum: false
    }
  });

  const toggleMandatory = (type) => {
    setInsurance((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        mandatory: !prev[type].mandatory
      }
    }));
  };

  const toggleSubOption = (type, key) => {
    setInsurance((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: !prev[type][key]
      }
    }));
  };

  useEffect(() => {
    onChange && onChange(insurance);
  }, [insurance]);

  const renderSubOptions = (type) => (
    <div className="ml-6 mt-2 space-y-2">
      {[
        { label: 'Full', key: 'full' },
        { label: 'Less Tensor', key: 'less_tensor' },
        { label: 'Lumsum', key: 'lumsum' }
      ].map(({ label, key }) => (
        <label
          key={key}
          className={`flex items-center space-x-2 text-sm cursor-pointer p-2 rounded-md transition-all duration-200 
            ${
              insurance[type][key]
                ? 'bg-blue-50 border-blue-200 shadow-sm'
                : 'bg-white border-gray-200 hover:border-blue-200'
            }
            focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
          `}
        >
          <div className="relative">
            <input
              type="checkbox"
              checked={insurance[type][key]}
              onChange={() => toggleSubOption(type, key)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                insurance[type][key]
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white border-gray-300'
              }`}
            >
              {insurance[type][key] && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <span
            className={`font-medium ${
              insurance[type][key] ? 'text-blue-700' : 'text-gray-700'
            }`}
          >
            {label}
          </span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Insurance Options</h3>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border border-gray-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={insurance.life_insurance.mandatory}
                onChange={() => toggleMandatory('life_insurance')}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                  insurance.life_insurance.mandatory
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-400'
                }`}
              >
                {insurance.life_insurance.mandatory && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <span
              className={`text-xl font-semibold ${
                insurance.life_insurance.mandatory ? 'text-blue-700' : 'text-gray-700'
              }`}
            >
              Life Insurance Mandatory
            </span>
          </label>
          {insurance.life_insurance.mandatory && renderSubOptions('life_insurance')}
        </div>

        <div className="bg-white p-4 rounded border border-gray-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={insurance.property_insurance.mandatory}
                onChange={() => toggleMandatory('property_insurance')}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                  insurance.property_insurance.mandatory
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-400'
                }`}
              >
                {insurance.property_insurance.mandatory && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <span
              className={`text-xl font-semibold ${
                insurance.property_insurance.mandatory ? 'text-blue-700' : 'text-gray-700'
              }`}
            >
              Property Insurance Mandatory
            </span>
          </label>
          {insurance.property_insurance.mandatory && renderSubOptions('property_insurance')}
        </div>

        <div className="bg-white p-4 rounded border border-gray-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={insurance.health_insurance.mandatory}
                onChange={() => toggleMandatory('health_insurance')}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                  insurance.health_insurance.mandatory
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-400'
                }`}
              >
                {insurance.health_insurance.mandatory && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <span
              className={`text-xl font-semibold ${
                insurance.health_insurance.mandatory ? 'text-blue-700' : 'text-gray-700'
              }`}
            >
              Health Insurance Mandatory
            </span>
          </label>
          {insurance.health_insurance.mandatory && renderSubOptions('health_insurance')}
        </div>
      </div>
    </div>
  );
};

export default InsuranceSection;