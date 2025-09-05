import React, { useEffect, useState } from 'react';
import CleanNumberInput from './CleanNumberInput'; // Make sure the path is correct

const Tenor = ({ onChange }) => {
  const [tenorSalaried, setTenorSalaried] = useState({ from: '', to: '' }); // Changed to empty strings
  const [tenorSelfEmployed, setTenorSelfEmployed] = useState({ from: '', to: '' }); // Changed to empty strings

  useEffect(() => {
    onChange && onChange('tenor_salaried', {
      from: tenorSalaried.from ? Number(tenorSalaried.from) : 0,
      to: tenorSalaried.to ? Number(tenorSalaried.to) : 0
    });
  }, [tenorSalaried]);

  useEffect(() => {
    onChange && onChange('tenor_self_employed', {
      from: tenorSelfEmployed.from ? Number(tenorSelfEmployed.from) : 0,
      to: tenorSelfEmployed.to ? Number(tenorSelfEmployed.to) : 0
    });
  }, [tenorSelfEmployed]);

  const handleSalariedChange = (field, value) => {
    setTenorSalaried((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelfEmployedChange = (field, value) => {
    setTenorSelfEmployed((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 uppercase tracking-wide">
          Tenor (Years)
        </h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salaried */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Salaried
            </label>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">From</label>
                <CleanNumberInput
                  value={tenorSalaried.from}
                  onChange={(value) => handleSalariedChange('from', value)}
                  placeholder="From"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">To</label>
                <CleanNumberInput
                  value={tenorSalaried.to}
                  onChange={(value) => handleSalariedChange('to', value)}
                  placeholder="To"
                />
              </div>
            </div>
          </div>

          {/* Self Employed */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Self Employed
            </label>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">From</label>
                <CleanNumberInput
                  value={tenorSelfEmployed.from}
                  onChange={(value) => handleSelfEmployedChange('from', value)}
                  placeholder="From"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">To</label>
                <CleanNumberInput
                  value={tenorSelfEmployed.to}
                  onChange={(value) => handleSelfEmployedChange('to', value)}
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tenor;