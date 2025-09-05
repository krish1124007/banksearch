import React, { useState, useEffect } from 'react';
import CleanNumberInput from './CleanNumberInput';

const Policy = ({ onChange }) => {
  const [isPolicyEnabled, setIsPolicyEnabled] = useState(false);
  const [isSalariedEnabled, setIsSalariedEnabled] = useState(false);
  const [isSelfEmployedEnabled, setIsSelfEmployedEnabled] = useState(false);
  const [isCibilEnabled, setIsCibilEnabled] = useState(false);

  const [salaried, setSalaried] = useState({
    foir_slabs: [{ income_range: 0, foir_gross: 0, foir_net: 0 }],
    cash_salary_accepted: false,
    additional_income: {
      rent: false,
      future_rental: false,
      incentive: false
    },
    company_type: {
      MNC: false,
      Govt: false,
      PvtLtd: false,
      LLP: false,
      Partnership: false,
      Trust: false,
      Individual: false
    },
    deduction: {
      PF: false,
      PT: false,
      no_deduction: false
    }
  });

  const [selfEmployed, setSelfEmployed] = useState({
    banking_surrogate: false,
    gst_surrogate: false,
    rtr_surrogate: false,
    industry_margin_surrogate: false,
    gross_profit_surrogate: false,
    lip: false,
    low_ltv: false,
    foir: false,
    combo: false,
    not_selected_text_1: '',
    not_selected_text_2: ''
  });

  const [cibil, setCibil] = useState({
    min_score: 0, // Initialize with a number
    call_accepted: false,
    accepted_type: [],
    current_bounce_accepted: false
  });

  const [uspDescription, setUspDescription] = useState('');

  const companyTypeLabels = {
    MNC: 'MNC',
    Govt: 'Government',
    PvtLtd: 'Private Limited',
    LLP: 'LLP',
    Partnership: 'Partnership',
    Trust: 'Trust',
    Individual: 'Individual'
  };

  const acceptedTypes = ['Old', 'Recent'];

  const resetPolicyState = () => {
    setIsSalariedEnabled(false);
    setIsSelfEmployedEnabled(false);
    setIsCibilEnabled(false);

    setSalaried({
      foir_slabs: [{ income_range: 0, foir_gross: 0, foir_net: 0 }],
      cash_salary_accepted: false,
      additional_income: {
        rent: false,
        future_rental: false,
        incentive: false
      },
      company_type: {
        MNC: false,
        Govt: false,
        PvtLtd: false,
        LLP: false,
        Partnership: false,
        Trust: false,
        Individual: false
      },
      deduction: {
        PF: false,
        PT: false,
        no_deduction: false
      }
    });
    setSelfEmployed({
      banking_surrogate: false,
      gst_surrogate: false,
      rtr_surrogate: false,
      industry_margin_surrogate: false,
      gross_profit_surrogate: false,
      lip: false,
      low_ltv: false,
      foir: false,
      combo: false,
      not_selected_text_1: '',
      not_selected_text_2: ''
    });
    setCibil({
      min_score: 0,
      call_accepted: false,
      accepted_type: [],
      current_bounce_accepted: false
    });
    setUspDescription('');
  };

  useEffect(() => {
    const policyData = {
      salaried: isSalariedEnabled ? salaried : null,
      self_employed: isSelfEmployedEnabled ? selfEmployed : null,
      cibil: isCibilEnabled ? cibil : null,
      usp_description: uspDescription
    };
    onChange && onChange(policyData);
  }, [isPolicyEnabled, isSalariedEnabled, isSelfEmployedEnabled, isCibilEnabled, salaried, selfEmployed, cibil, uspDescription]);

  const handleSalariedChange = (field, value) => {
    setSalaried(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedSalariedChange = (section, field, value) => {
    setSalaried(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFoirSlabChange = (index, field, value) => {
    setSalaried(prev => ({
      ...prev,
      foir_slabs: prev.foir_slabs.map((slab, i) =>
        i === index ? { ...slab, [field]: value } : slab // Convert to number here
      )
    }));
  };

  const addFoirSlab = () => {
    setSalaried(prev => ({
      ...prev,
      foir_slabs: [...prev.foir_slabs, { income_range: 0, foir_gross: 0, foir_net: 0 }] // Add new slabs with numbers
    }));
  };

  const removeFoirSlab = (index) => {
    setSalaried(prev => ({
      ...prev,
      foir_slabs: prev.foir_slabs.filter((_, i) => i !== index)
    }));
  };

  const handleSelfEmployedChange = (field, value) => {
    setSelfEmployed(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCibilChange = (field, value) => {
    setCibil(prev => ({
      ...prev,
      [field]: field === 'min_score' ? value : value // Convert min_score to number
    }));
  };

  const handleAcceptedTypeToggle = (type) => {
    setCibil(prev => ({
      ...prev,
      accepted_type: prev.accepted_type.includes(type)
        ? prev.accepted_type.filter(t => t !== type)
        : [...prev.accepted_type, type]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className={`${isPolicyEnabled ? 'bg-blue-500' : 'bg-gray-100'} px-6 py-4 transition-colors duration-200`}>
        <label className="flex items-center space-x-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={isPolicyEnabled}
              onChange={() => {
                setIsPolicyEnabled((prev) => {
                  const next = !prev;
                  if (!next) resetPolicyState();
                  return next;
                });
              }}
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-200 ${isPolicyEnabled
              ? 'bg-white border-white'
              : 'bg-transparent border-gray-400'
              }`}>
              {isPolicyEnabled && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <span className={`text-xl font-semibold ${isPolicyEnabled ? 'text-white' : 'text-gray-700'}`}>
            Policy
          </span>
        </label>
      </div>

      {isPolicyEnabled && (
        <div className="p-6 bg-gray-50 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${isSalariedEnabled ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'
              }`}>
              <input
                type="checkbox"
                checked={isSalariedEnabled}
                onChange={(e) => setIsSalariedEnabled(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${isSalariedEnabled ? 'bg-blue-500 border-blue-200' : 'bg-white border-gray-300'
                }`}>
                {isSalariedEnabled && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium ${isSalariedEnabled ? 'text-blue-700' : 'text-gray-700'}`}>Enable Salaried Policy</span>
            </label>

            <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${isSelfEmployedEnabled ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'
              }`}>
              <input
                type="checkbox"
                checked={isSelfEmployedEnabled}
                onChange={(e) => setIsSelfEmployedEnabled(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${isSelfEmployedEnabled ? 'bg-blue-500 border-blue-200' : 'bg-white border-gray-300'
                }`}>
                {isSelfEmployedEnabled && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium ${isSelfEmployedEnabled ? 'text-blue-700' : 'text-gray-700'}`}>Enable Self-Employed Policy</span>
            </label>

            <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${isCibilEnabled ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'
              }`}>
              <input
                type="checkbox"
                checked={isCibilEnabled}
                onChange={(e) => setIsCibilEnabled(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${isCibilEnabled ? 'bg-blue-500 border-blue-200' : 'bg-white border-gray-300'
                }`}>
                {isCibilEnabled && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium ${isCibilEnabled ? 'text-blue-700' : 'text-gray-700'}`}>Enable CIBIL Policy</span>
            </label>
          </div>

          {isSalariedEnabled && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-6 uppercase tracking-wide">
                Salaried Policy
              </h4>

              {/* FOIR Slabs */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-base font-semibold text-gray-700">FOIR Slabs</h5>
                  <button
                    onClick={addFoirSlab}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Add Slab
                  </button>
                </div>
                <div className="space-y-3">
                  {salaried.foir_slabs.map((slab, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <CleanNumberInput
                          value={slab.income_range}
                          onChange={(value) => handleFoirSlabChange(index, 'income_range', value)}
                          className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-200"
                          placeholder="Income Range"
                        />
                        <CleanNumberInput
                          value={slab.foir_gross}
                          onChange={(value) => handleFoirSlabChange(index, 'foir_gross', value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-200"
                          placeholder="FOIR Gross"
                        />
                        <CleanNumberInput
                          value={slab.foir_net}
                          onChange={(value) => handleFoirSlabChange(index, 'foir_net', value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-200"
                          placeholder="FOIR Net"
                        />
                      </div>
                      {salaried.foir_slabs.length > 1 && (
                        <button
                          onClick={() => removeFoirSlab(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${salaried.cash_salary_accepted ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'
                  }`}>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={salaried.cash_salary_accepted}
                      onChange={(e) => handleSalariedChange('cash_salary_accepted', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${salaried.cash_salary_accepted
                      ? 'bg-blue-500 border-blue-200'
                      : 'bg-white border-gray-300'
                      }`}>
                      {salaried.cash_salary_accepted && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${salaried.cash_salary_accepted ? 'text-blue-700' : 'text-gray-700'}`}>Cash Salary Accepted</span>
                </label>
              </div>

              <div className="mb-6">
                <h5 className="text-base font-semibold text-gray-700 mb-3">Additional Income</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(salaried.additional_income).map(([key, value]) => (
                    <label key={key} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'
                      }`}>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNestedSalariedChange('additional_income', key, e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${value ? 'bg-blue-500 border-blue-200' : 'bg-white border-gray-300'
                          }`}>
                          {value && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-medium capitalize ${value ? 'text-blue-700' : 'text-gray-700'}`}>
                        {key.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-base font-semibold text-gray-700 mb-3">Company Type</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(salaried.company_type).map(([key, value]) => (
                    <label key={key} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'
                      }`}>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNestedSalariedChange('company_type', key, e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${value ? 'bg-blue-500 border-blue-200' : 'bg-white border-gray-300'
                          }`}>
                          {value && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${value ? 'text-blue-700' : 'text-gray-700'}`}>
                        {companyTypeLabels[key]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-base font-semibold text-gray-700 mb-3">Deduction</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(salaried.deduction).map(([key, value]) => (
                    <label key={key} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'
                      }`}>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNestedSalariedChange('deduction', key, e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${value ? 'bg-blue-500 border-blue-200' : 'bg-white border-gray-300'
                          }`}>
                          {value && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${value ? 'text-blue-700' : 'text-gray-700'}`}>
                        {key === 'no_deduction' ? 'No Deduction' : key.toUpperCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isSelfEmployedEnabled && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-6 uppercase tracking-wide">
                Self-Employed Policy
              </h4>

              <div className="mb-6">
                <h5 className="text-base font-semibold text-gray-700 mb-3">Surrogate Options</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(selfEmployed).filter(([key]) =>
                    !['not_selected_text_1', 'not_selected_text_2'].includes(key)
                  ).map(([key, value]) => (
                    <label key={key} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${value ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'
                      }`}>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSelfEmployedChange(key, e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${value ? 'bg-blue-500 border-blue-200' : 'bg-white border-gray-300'
                          }`}>
                          {value && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-medium capitalize ${value ? 'text-blue-700' : 'text-gray-700'}`}>
                        {key.replace(/_/g, ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Not Selected Text 1</label>
                  <textarea
                    value={selfEmployed.not_selected_text_1}
                    onChange={(e) => handleSelfEmployedChange('not_selected_text_1', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-200 text-sm transition-colors duration-200"
                    placeholder="Explain why some options were not selected"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Not Selected Text 2</label>
                  <textarea
                    value={selfEmployed.not_selected_text_2}
                    onChange={(e) => handleSelfEmployedChange('not_selected_text_2', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-200 text-sm transition-colors duration-200"
                    placeholder="Optional additional note"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          )}

          {isCibilEnabled && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-6 uppercase tracking-wide">
                CIBIL Policy
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Minimum Score</label>
                  <CleanNumberInput
                    value={cibil.min_score}
                    onChange={(value) => handleCibilChange('min_score', value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-200 text-sm transition-colors duration-200"
                    placeholder="Enter minimum CIBIL score"
                  />
                </div>

                <div className="space-y-4">
                  <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${cibil.call_accepted ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'
                    }`}>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={cibil.call_accepted}
                        onChange={(e) => handleCibilChange('call_accepted', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${cibil.call_accepted ? 'bg-blue-500 border-blue-200' : 'bg-white border-gray-300'
                        }`}>
                        {cibil.call_accepted && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${cibil.call_accepted ? 'text-blue-700' : 'text-gray-700'}`}>Call Accepted</span>
                  </label>

                  <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${cibil.current_bounce_accepted ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'
                    }`}>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={cibil.current_bounce_accepted}
                        onChange={(e) => handleCibilChange('current_bounce_accepted', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${cibil.current_bounce_accepted ? 'bg-blue-500 border-blue-200' : 'bg-white border-gray-300'
                        }`}>
                        {cibil.current_bounce_accepted && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${cibil.current_bounce_accepted ? 'text-blue-700' : 'text-gray-700'}`}>Current Bounce Accepted</span>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <h5 className="text-base font-semibold text-gray-700 mb-3">Accepted Type</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {acceptedTypes.map((type) => (
                    <label key={type} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${cibil.accepted_type.includes(type) ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'
                      }`}>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={cibil.accepted_type.includes(type)}
                          onChange={() => handleAcceptedTypeToggle(type)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${cibil.accepted_type.includes(type) ? 'bg-blue-500 border-blue-200' : 'bg-white border-gray-300'
                          }`}>
                          {cibil.accepted_type.includes(type) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${cibil.accepted_type.includes(type) ? 'text-blue-700' : 'text-gray-700'}`}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide">
              USP Description
            </h4>
            <textarea
              value={uspDescription}
              onChange={(e) => setUspDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-200 text-sm transition-colors duration-200"
              placeholder="Enter USP description..."
              rows="4"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Policy;