import React, { useState, useEffect } from 'react';
import CleanNumberInput from './CleanNumberInput'; // Make sure the path is correct

const IndustrialLoan = ({ onChange }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [options, setOptions] = useState({
    builder_purchase: false,
    resale: false
  });
  const [interest, setInterest] = useState({
    salaried: { from: 0, to: 0, foir: 0 }, // Changed to empty strings
    non_salaried: { from: 0, to: 0, foir: 0 } // Changed to empty strings
  });

  const [ltvRanges, setLtvRanges] = useState("");
  const [loanTicketSize, setLoanTicketSize] = useState({
    from: 0,
    to: 0
  });

  const resetIndustrialLoanState = () => {
    setOptions({
      builder_purchase: false,
      resale: false
    });
    setInterest({
      salaried: { from: 0, to: 0, foir: 0 },
      non_salaried: { from: 0, to: 0, foir: 0 }
    });
    setLtvRanges("");
    setLoanTicketSize({ from: 0, to: 0 });
  };

  useEffect(() => {
    onChange({
      industrial_loan: isEnabled,
      ...options,
      interest_rate: interest,
      LTV: ltvRanges,
      loan_ticket_size: loanTicketSize
    });
  }, [isEnabled, options, interest, ltvRanges, loanTicketSize]);

  const toggleOption = (key) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`${isEnabled ? 'bg-blue-500' : 'bg-gray-100'} px-6 py-4 transition-colors duration-200`}>
        <label className="flex items-center space-x-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={() => {
                setIsEnabled((prev) => {
                  const next = !prev;
                  if (!next) resetIndustrialLoanState();
                  return next;
                });
              }}
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
              isEnabled
                ? 'bg-white border-white'
                : 'bg-transparent border-gray-400'
            }`}>
              {isEnabled && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <span className={`text-xl font-semibold ${isEnabled ? 'text-white' : 'text-gray-700'}`}>
            Industrial Loan
          </span>
        </label>
      </div>

      {isEnabled && (
        <div className="p-6 bg-gray-50 space-y-6">
          {/* Industrial Loan Options Section */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide">
              Loan Options
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["Builder Purchase", "builder_purchase"],
                ["Resale", "resale"]
              ].map(([label, key]) => (
                <label key={key} className="group cursor-pointer">
                  <div className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                    options[key]
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-blue-200'
                  }`}>
                    <div className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={options[key]}
                        onChange={() => toggleOption(key)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                        options[key]
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-white border-gray-300'
                      }`}>
                        {options[key] && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      options[key] ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Interest Rates with FOIR */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide">
              Interest Rate Range (%)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['salaried', 'non_salaried'].map((type) => (
                <div key={type}>
                  <label className="block text-base font-semibold text-gray-700 mb-3 capitalize">
                    {type.replace('_', ' ')}
                  </label>
                  <div className="flex flex-col space-y-4">
                    <div className="flex space-x-4">
                      {['from', 'to'].map((range) => (
                        <div key={range} className="flex-1">
                          <label className="block text-sm text-gray-600 mb-1">
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                          </label>
                          <CleanNumberInput
                            value={interest[type][range]}
                            onChange={(value) =>
                              setInterest((prev) => ({
                                ...prev,
                                [type]: {
                                  ...prev[type],
                                  [range]: value
                                }
                              }))
                            }
                            placeholder={range === 'from' ? '7.5' : '9.5'}
                          />
                        </div>
                      ))}
                    </div>
                    {/* FOIR Input */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">FOIR</label>
                      <CleanNumberInput
                        value={interest[type].foir}
                        onChange={(value) =>
                          setInterest((prev) => ({
                            ...prev,
                            [type]: { ...prev[type], foir: value }
                          }))
                        }
                        placeholder="FOIR"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LTV Section (kept as regular text input) */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800 uppercase tracking-wide">
                LTV Ranges
              </h4>
            </div>

            <div>
              <input 
                type="text" 
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200'
                value={ltvRanges}
                onChange={(e) => setLtvRanges(e.target.value)}
              />
            </div>
          </div>

          {/* Loan Ticket Size */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide">
              Loan Ticket Size Range
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">From</label>
                <CleanNumberInput
                  value={loanTicketSize.from}
                  onChange={(value) => setLoanTicketSize(prev => ({ ...prev, from: value }))}
                  placeholder="From"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">To</label>
                <CleanNumberInput
                  value={loanTicketSize.to}
                  onChange={(value) => setLoanTicketSize(prev => ({ ...prev, to: value }))}
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustrialLoan;