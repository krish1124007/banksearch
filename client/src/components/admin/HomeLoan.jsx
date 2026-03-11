import React, { useState, useEffect } from 'react';
import CleanNumberInput from './CleanNumberInput';

const HomeLoan = ({ onChange }) => {
  const [isHomeEnabled, setIsHomeEnabled] = useState(false);
  const [contactNumber, setContactNumber] = useState('');

  const [interest, setInterest] = useState({
    salaried: { from: 0, to: 0, foir: 0 },
    non_salaried: { from: 0, to: 0, foir: 0 }
  });

  // Updated LTV state to use array of objects
  const [ltvRanges, setLtvRanges] = useState("");

  const [loanTicketSize, setLoanTicketSize] = useState({
    from: 0,
    to: 0
  });

  const [options, setOptions] = useState({
    under_construction: false,
    ready_possession: false,
    resale: false,
    balance_transfer: false,
    balance_transfer_and_topup: false,
    plot_purchase: false,
    plot_plus_construction: false,
    pg: false,
    city_area: false,
    old_age_property: false
  });

  const [nirHomeLoan, setNirHomeLoan] = useState({
    salary_in_dollar: false,
    visa_type: 'Student'
  });

  const [layoutPlan, setLayoutPlan] = useState(0);
  const [unitPlan, setUnitPlan] = useState(0);

  const labelMap = {
    "Under Construction": "under_construction",
    "Ready Possession": "ready_possession",
    "Resale": "resale",
    "Balance Transfer": "balance_transfer",
    "Balance Transfer + Topup": "balance_transfer_and_topup",
    "Plot Purchase": "plot_purchase",
    "Plot + Construction": "plot_plus_construction",
    "PG": "pg",
    "City Area": "city_area",
    "Old Age Property": "old_age_property"
  };

  const visaTypes = ['Student', 'Work', 'Tourist', 'Business', 'Permanent Resident', 'Other'];

  const resetHomeLoanState = () => {
    setOptions({
      under_construction: false,
      ready_possession: false,
      resale: false,
      balance_transfer: false,
      balance_transfer_and_topup: false,
      plot_purchase: false,
      plot_plus_construction: false,
      pg: false,
      city_area: false,
      old_age_property: false
    });
    setInterest({
      salaried: { from: 0, to: 0, foir: 0 },
      non_salaried: { from: 0, to: 0, foir: 0 }
    });
    setLtvRanges("");
    setLoanTicketSize({ from: 0, to: 0 });
    setContactNumber('');
    setNirHomeLoan({
      salary_in_dollar: false,
      visa_type: 'Student'
    });
    setLayoutPlan(0);
    setUnitPlan(0);
  };

  useEffect(() => {
    onChange({
      home_loan: isHomeEnabled,
      contact_number: contactNumber,
      ...options,
      nir_home_loan: nirHomeLoan,
      interest_rate: interest,
      LTV: ltvRanges, // Updated to use ltvRanges array
      loan_ticket_size: loanTicketSize,
      layout_plan: layoutPlan,
      unit_plan: unitPlan
    });
  }, [isHomeEnabled, contactNumber, options, nirHomeLoan, interest, ltvRanges, loanTicketSize, layoutPlan, unitPlan]);

  const handleToggleOption = (key) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const showUnitLayoutPlan = Object.entries(options).some(
    ([key, value]) =>
      value &&
      key !== 'under_construction' &&
      key !== 'ready_possession'
  );

  // LTV Range Handlers



  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`${isHomeEnabled ? 'bg-blue-500' : 'bg-gray-100'} px-6 py-4 transition-colors duration-200`}>
        <label className="flex items-center space-x-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={isHomeEnabled}
              onChange={() => {
                setIsHomeEnabled((prev) => {
                  const next = !prev;
                  if (!next) resetHomeLoanState();
                  return next;
                });
              }}
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-200 ${isHomeEnabled
              ? 'bg-white border-white'
              : 'bg-transparent border-gray-400'
              }`}>
              {isHomeEnabled && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <span className={`text-xl font-medium ${isHomeEnabled ? 'text-white' : 'text-gray-700'}`}>
            Home Loan
          </span>
        </label>
      </div>

      {isHomeEnabled && (
        <div className="p-6 bg-gray-50 space-y-6">


          {/* Loan Options */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide">
              Loan Options
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(labelMap).map(([label, key]) => (
                <label key={key} className="group cursor-pointer">
                  <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 ${options[key]
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-blue-200'
                    }`}>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={!!options[key]}
                        onChange={() => handleToggleOption(key)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${options[key]
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
                    <span className={`text-sm font-medium ${options[key] ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                      {label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* NIR Home Loan */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide">
              NIR Home Loan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 bg-white hover:border-blue-200 transition-all duration-200">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={nirHomeLoan.salary_in_dollar}
                      onChange={(e) => setNirHomeLoan(prev => ({ ...prev, salary_in_dollar: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${nirHomeLoan.salary_in_dollar
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300'
                      }`}>
                      {nirHomeLoan.salary_in_dollar && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Salary in Dollar
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Visa Type</label>
                <select
                  value={nirHomeLoan.visa_type}
                  onChange={(e) => setNirHomeLoan(prev => ({ ...prev, visa_type: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
                >
                  {visaTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Conditional Unit/Layout Plan Display */}
          {showUnitLayoutPlan && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide">
                Additional Documents
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Unit Plan (Years)</label>
                  <CleanNumberInput
                    value={unitPlan}
                    onChange={(val) => setUnitPlan(val)}
                    placeholder="0 = false, >0 = years"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Layout Plan (Years)</label>
                  <CleanNumberInput
                    value={layoutPlan}
                    onChange={(val) => setLayoutPlan(val)}
                    placeholder="0 = false, >0 = years"
                  />



                </div>
              </div>
            </div>
          )}

          {/* Interest Rate */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide">
              Interest Rate Range (%)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Salaried */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">Salaried</label>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-sm text-gray-600 mb-1">From (%)</label>
                      <CleanNumberInput
                        value={interest.salaried.from}
                        onChange={(val) =>
                          setInterest((prev) => ({
                            ...prev,
                            salaried: { ...prev.salaried, from: val }
                          }))
                        }
                        placeholder="From"
                      />

                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm text-gray-600 mb-1">To (%)</label>
                      <CleanNumberInput
                        value={interest.salaried.to}
                        onChange={(val) =>
                          setInterest((prev) => ({
                            ...prev,
                            salaried: { ...prev.salaried, to: val }
                          }))
                        }
                        placeholder="To"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">FOIR (%)</label>
                    <div className="relative">
                      <CleanNumberInput
                        value={interest.salaried.foir}
                        onChange={(val) =>
                          setInterest((prev) => ({
                            ...prev,
                            salaried: { ...prev.salaried, foir: val }
                          }))
                        }
                        placeholder="FOIR"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Non-Salaried */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">Non-Salaried</label>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-sm text-gray-600 mb-1">From (%)</label>
                      <CleanNumberInput
                        value={interest.non_salaried.from}
                        onChange={(val) =>
                          setInterest((prev) => ({
                            ...prev,
                            non_salaried: { ...prev.non_salaried, from: val }
                          }))
                        }
                        placeholder="From"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm text-gray-600 mb-1">To (%)</label>
                      <CleanNumberInput
                        value={interest.non_salaried.to}
                        onChange={(val) =>
                          setInterest((prev) => ({
                            ...prev,
                            non_salaried: { ...prev.non_salaried, to: val }
                          }))
                        }
                        placeholder="To"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">FOIR (%)</label>
                    <div className="relative">
                      <CleanNumberInput
                        value={interest.non_salaried.foir}
                        onChange={(val) =>
                          setInterest((prev) => ({
                            ...prev,
                            non_salaried: { ...prev.non_salaried, foir: val }
                          }))
                        }
                        placeholder="FOIR"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Updated LTV Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800 uppercase tracking-wide">
                LTV Ranges
              </h4>

            </div>

            <div>
              <input type="text" className='w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200'
              onChange={(e)=>setLtvRanges(e.target.value)}
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
                  onChange={(val) => setLoanTicketSize(prev => ({ ...prev, from: val }))}
                  placeholder="From"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">To</label>
                
                <CleanNumberInput
                  value={loanTicketSize.to}
                  onChange={(val) => setLoanTicketSize(prev => ({ ...prev, to: val }))}
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

export default HomeLoan;