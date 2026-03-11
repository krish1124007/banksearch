import React, { useState, useEffect } from 'react';
import CleanNumberInput from './CleanNumberInput';

const Chk = ({ label, checked, onChange }) => (
  <label className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 ${checked ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200'}`}>
    <div className="relative">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${checked ? 'bg-blue-500 border-blue-200' : 'bg-white border-gray-300'}`}>
        {checked && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
      </div>
    </div>
    <span className={`text-sm font-medium ${checked ? 'text-blue-700' : 'text-gray-700'}`}>{label}</span>
  </label>
);

const SurrogateBlock = ({ field, label, color, selfEmployed, onSEChange, children }) => (
  <div className={`rounded-lg border-2 transition-all p-3 ${selfEmployed[field] ? `border-${color}-300 bg-${color}-50` : 'border-gray-200 bg-white'}`}>
    <Chk label={label} checked={selfEmployed[field]} onChange={(e) => onSEChange(field, e.target.checked)} />
    {selfEmployed[field] && children}
  </div>
);

const Policy = ({ onChange }) => {
  const [isPolicyEnabled, setIsPolicyEnabled] = useState(false);
  const [isSalariedEnabled, setIsSalariedEnabled] = useState(false);
  const [isSelfEmployedEnabled, setIsSelfEmployedEnabled] = useState(false);
  const [isCibilEnabled, setIsCibilEnabled] = useState(false);

  const [salaried, setSalaried] = useState({
    foir_slabs: [{ income_range: '', foir_gross: '', foir_net: '' }],
    cash_salary_accepted: false,
    additional_income: { rent: false, future_rental: false, incentive: false },
    company_type: { MNC: false, Govt: false, PvtLtd: false, LLP: false, Partnership: false, Trust: false, Individual: false },
    deduction: { PF: false, PT: false, no_deduction: false }
  });

  const [selfEmployed, setSelfEmployed] = useState({
    banking_surrogate: false,
    banking_surrogate_details: { dates: '', period: '6_month', foir_of_abb: '', max_club_account: '' },
    gst_surrogate: false,
    gst_surrogate_ratio: '',
    rtr_surrogate: false,
    rtr_surrogate_ratio: '',
    industry_margin_surrogate: false,
    industry_margin_surrogate_ratio: '',
    gross_profit_surrogate: false,
    gross_profit_surrogate_ratio: '',
    lip: false,
    lip_details: { max_multiple: '', foir: '' },
    low_ltv: false,
    low_ltv_ratio: '',
    low_ltv_max_amount: '',
    foir: false,
    se_foir_slabs: [{ income_range: '', foir_gross: '', foir_net: '' }],
    combo: false,
    abb_required: false,
    abb_ratio: '',
    dod: false,
    dod_details: { renewal_charges: false, renewal_charges_value: '', renewal_charges_type: 'amount', utilization_ratio_quarterly: '', turnover_ratio_applicable: false },
    itr_required: '2_year',
    bcp_years: '',
    not_selected_text_1: '',
    not_selected_text_2: ''
  });

  const [cibil, setCibil] = useState({
    min_score: '',
    call_accepted: false,
    accepted_type: [],
    current_bounce_accepted: false
  });

  const [uspDescription, setUspDescription] = useState('');

  const companyTypeLabels = {
    MNC: 'MNC',
    Govt: 'Govt. / PSU',
    PvtLtd: 'Private Ltd.',
    LLP: 'LLP',
    Partnership: 'Partnership',
    Trust: 'Trust / Society',
    Individual: 'Individual / Prop.'
  };

  const acceptedTypes = ['Old', 'Recent'];

  useEffect(() => {
    if (onChange) {
      onChange({
        salaried: isSalariedEnabled ? salaried : null,
        self_employed: isSelfEmployedEnabled ? selfEmployed : null,
        cibil: isCibilEnabled ? cibil : null,
        usp_description: uspDescription
      });
    }
  }, [isSalariedEnabled, isSelfEmployedEnabled, isCibilEnabled, salaried, selfEmployed, cibil, uspDescription]);

  const handleSalariedChange = (field, value) => {
    setSalaried(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedSalariedChange = (parent, field, value) => {
    setSalaried(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleFoirSlabChange = (index, field, value) => {
    const newSlabs = [...salaried.foir_slabs];
    newSlabs[index][field] = value;
    setSalaried(prev => ({ ...prev, foir_slabs: newSlabs }));
  };

  const addFoirSlab = () => {
    setSalaried(prev => ({
      ...prev,
      foir_slabs: [...prev.foir_slabs, { income_range: '', foir_gross: '', foir_net: '' }]
    }));
  };

  const removeFoirSlab = (index) => {
    setSalaried(prev => ({
      ...prev,
      foir_slabs: prev.foir_slabs.filter((_, i) => i !== index)
    }));
  };

  const handleSEChange = (field, value) => {
    setSelfEmployed(prev => ({ ...prev, [field]: value }));
  };

  const handleSENestedChange = (parent, field, value) => {
    setSelfEmployed(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const handleCibilChange = (field, value) => {
    setCibil(prev => ({ ...prev, [field]: value }));
  };

  const handleAcceptedTypeToggle = (type) => {
    setCibil(prev => {
      const nextTypes = prev.accepted_type.includes(type)
        ? prev.accepted_type.filter(t => t !== type)
        : [...prev.accepted_type, type];
      return { ...prev, accepted_type: nextTypes };
    });
  };

  const resetPolicyState = () => {
    setIsSalariedEnabled(false);
    setIsSelfEmployedEnabled(false);
    setIsCibilEnabled(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Policy Header Toggle */}
      <div className={`${isPolicyEnabled ? 'bg-blue-500' : 'bg-gray-100'} px-6 py-4 transition-colors duration-200`}>
        <label className="flex items-center space-x-3 cursor-pointer">
          <div className="relative">
            <input type="checkbox" checked={isPolicyEnabled} onChange={() => { setIsPolicyEnabled(prev => { const next = !prev; if (!next) resetPolicyState(); return next; }); }} className="sr-only" />
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-200 ${isPolicyEnabled ? 'bg-white border-white' : 'bg-transparent border-gray-400'}`}>
              {isPolicyEnabled && <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </div>
          </div>
          <span className={`text-xl font-semibold ${isPolicyEnabled ? 'text-white' : 'text-gray-700'}`}>Policy</span>
        </label>
      </div>

      {isPolicyEnabled && (
        <div className="p-6 bg-gray-50 space-y-8">
          {/* Enable toggles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Chk label="Enable Salaried Policy" checked={isSalariedEnabled} onChange={(e) => setIsSalariedEnabled(e.target.checked)} />
            <Chk label="Enable Self-Employed Policy" checked={isSelfEmployedEnabled} onChange={(e) => setIsSelfEmployedEnabled(e.target.checked)} />
            <Chk label="Enable CIBIL Policy" checked={isCibilEnabled} onChange={(e) => setIsCibilEnabled(e.target.checked)} />
          </div>

          {/* ── SALARIED POLICY ── */}
          {isSalariedEnabled && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-6 uppercase tracking-wide">Salaried Policy</h4>

              {/* FOIR Slabs */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-base font-semibold text-gray-700">FOIR Slabs</h5>
                  <button type="button" onClick={addFoirSlab} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">Add Slab</button>
                </div>
                <div className="space-y-3">
                  {salaried.foir_slabs.map((slab, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <CleanNumberInput value={slab.income_range} onChange={(v) => handleFoirSlabChange(index, 'income_range', v)} className="px-3 py-2 border rounded-lg text-sm w-full" placeholder="Income Range" />
                        <CleanNumberInput value={slab.foir_gross} onChange={(v) => handleFoirSlabChange(index, 'foir_gross', v)} className="px-3 py-2 border rounded-lg text-sm w-full" placeholder="FOIR Gross %" />
                        <CleanNumberInput value={slab.foir_net} onChange={(v) => handleFoirSlabChange(index, 'foir_net', v)} className="px-3 py-2 border rounded-lg text-sm w-full" placeholder="FOIR Net %" />
                      </div>
                      {salaried.foir_slabs.length > 1 && (
                        <button type="button" onClick={() => removeFoirSlab(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <Chk label="Cash Salary Accepted" checked={salaried.cash_salary_accepted} onChange={(e) => handleSalariedChange('cash_salary_accepted', e.target.checked)} />
              </div>

              <div className="mb-6">
                <h5 className="text-base font-semibold text-gray-700 mb-3">Additional Income</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(salaried.additional_income).map(([key, value]) => (
                    <Chk key={key} label={key.replace('_', ' ')} checked={value} onChange={(e) => handleNestedSalariedChange('additional_income', key, e.target.checked)} />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-base font-semibold text-gray-700 mb-3">Company Type</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(salaried.company_type).map(([key, value]) => (
                    <Chk key={key} label={companyTypeLabels[key]} checked={value} onChange={(e) => handleNestedSalariedChange('company_type', key, e.target.checked)} />
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-base font-semibold text-gray-700 mb-3">Deduction</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(salaried.deduction).map(([key, value]) => (
                    <Chk key={key} label={key === 'no_deduction' ? 'No Deduction' : key.toUpperCase()} checked={value} onChange={(e) => handleNestedSalariedChange('deduction', key, e.target.checked)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SELF-EMPLOYED POLICY ── */}
          {isSelfEmployedEnabled && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-6 uppercase tracking-wide">Self-Employed Policy</h4>

              <div className="mb-6">
                <h5 className="text-base font-semibold text-gray-700 mb-3">Programme Options</h5>
                <div className="space-y-3">

                  {/* Banking Surrogate */}
                  <SurrogateBlock field="banking_surrogate" label="Banking Surrogate" color="blue" selfEmployed={selfEmployed} onSEChange={handleSEChange}>
                    <div className="ml-4 mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-blue-700 mb-1">Dates (6 numbers with comma)</label>
                        <input type="text" value={selfEmployed.banking_surrogate_details.dates}
                          onChange={(e) => handleSENestedChange('banking_surrogate_details', 'dates', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg text-sm" placeholder="e.g. 1,5,10,15,20,25" maxLength={17} />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-700 mb-1">Period</label>
                        <select value={selfEmployed.banking_surrogate_details.period}
                          onChange={(e) => handleSENestedChange('banking_surrogate_details', 'period', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg text-sm">
                          <option value="6_month">6 Months</option>
                          <option value="9_month">9 Months</option>
                          <option value="1_year">1 Year</option>
                        </select>
                      </div>
                      <div className="relative">
                        <label className="block text-sm text-blue-700 mb-1">FOIR of ABB (%)</label>
                        <CleanNumberInput value={selfEmployed.banking_surrogate_details.foir_of_abb}
                          onChange={(v) => handleSENestedChange('banking_surrogate_details', 'foir_of_abb', v)}
                          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg text-sm pr-7" placeholder="%" />
                        <span className="absolute right-3 bottom-2 text-blue-500 text-sm">%</span>
                      </div>
                      <div>
                        <label className="block text-sm text-blue-700 mb-1">Max Club Account</label>
                        <CleanNumberInput value={selfEmployed.banking_surrogate_details.max_club_account}
                          onChange={(v) => handleSENestedChange('banking_surrogate_details', 'max_club_account', v)}
                          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg text-sm" placeholder="Count" />
                      </div>
                    </div>
                  </SurrogateBlock>

                  {/* GST Surrogate */}
                  <SurrogateBlock field="gst_surrogate" label="GST Surrogate" color="green" selfEmployed={selfEmployed} onSEChange={handleSEChange}>
                    <div className="ml-4 mt-2 max-w-xs relative">
                      <label className="block text-sm text-green-700 mb-1">GST Surrogate Ratio (%)</label>
                      <CleanNumberInput value={selfEmployed.gst_surrogate_ratio || 0}
                        onChange={(v) => handleSEChange('gst_surrogate_ratio', v)}
                        className="w-full px-3 py-2 border-2 border-green-200 rounded-lg text-sm pr-7" placeholder="%" />
                      <span className="absolute right-3 bottom-2 text-green-600 text-sm">%</span>
                    </div>
                  </SurrogateBlock>

                  {/* RTR Surrogate */}
                  <SurrogateBlock field="rtr_surrogate" label="RTR Surrogate" color="orange" selfEmployed={selfEmployed} onSEChange={handleSEChange}>
                    <div className="ml-4 mt-2 max-w-xs relative">
                      <label className="block text-sm text-orange-700 mb-1">RTR Surrogate Ratio (%)</label>
                      <CleanNumberInput value={selfEmployed.rtr_surrogate_ratio || 0}
                        onChange={(v) => handleSEChange('rtr_surrogate_ratio', v)}
                        className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg text-sm pr-7" placeholder="%" />
                      <span className="absolute right-3 bottom-2 text-orange-600 text-sm">%</span>
                    </div>
                  </SurrogateBlock>

                  {/* Industry Margin Surrogate */}
                  <SurrogateBlock field="industry_margin_surrogate" label="Industry Margin Surrogate" color="teal" selfEmployed={selfEmployed} onSEChange={handleSEChange}>
                    <div className="ml-4 mt-2 max-w-xs relative">
                      <label className="block text-sm text-teal-700 mb-1">Industry Margin Ratio (%)</label>
                      <CleanNumberInput value={selfEmployed.industry_margin_surrogate_ratio || 0}
                        onChange={(v) => handleSEChange('industry_margin_surrogate_ratio', v)}
                        className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg text-sm pr-7" placeholder="%" />
                      <span className="absolute right-3 bottom-2 text-teal-600 text-sm">%</span>
                    </div>
                  </SurrogateBlock>

                  {/* Gross Profit Surrogate */}
                  <SurrogateBlock field="gross_profit_surrogate" label="Gross Profit Surrogate" color="indigo" selfEmployed={selfEmployed} onSEChange={handleSEChange}>
                    <div className="ml-4 mt-2 max-w-xs relative">
                      <label className="block text-sm text-indigo-700 mb-1">Gross Profit Ratio (%)</label>
                      <CleanNumberInput value={selfEmployed.gross_profit_surrogate_ratio || 0}
                        onChange={(v) => handleSEChange('gross_profit_surrogate_ratio', v)}
                        className="w-full px-3 py-2 border-2 border-indigo-200 rounded-lg text-sm pr-7" placeholder="%" />
                      <span className="absolute right-3 bottom-2 text-indigo-600 text-sm">%</span>
                    </div>
                  </SurrogateBlock>

                  {/* LIP — inline max multiple + FOIR */}
                  <SurrogateBlock field="lip" label="LIP" color="purple" selfEmployed={selfEmployed} onSEChange={handleSEChange}>
                    <div className="ml-4 mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-purple-700 mb-1">Max Multiple</label>
                        <CleanNumberInput value={selfEmployed.lip_details.max_multiple}
                          onChange={(v) => handleSENestedChange('lip_details', 'max_multiple', v)}
                          className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg text-sm" placeholder="e.g. 3" />
                      </div>
                      <div className="relative">
                        <label className="block text-sm text-purple-700 mb-1">LIP FOIR (%)</label>
                        <CleanNumberInput value={selfEmployed.lip_details.foir}
                          onChange={(v) => handleSENestedChange('lip_details', 'foir', v)}
                          className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg text-sm pr-7" placeholder="%" />
                        <span className="absolute right-3 bottom-2 text-purple-600 text-sm">%</span>
                      </div>
                    </div>
                  </SurrogateBlock>

                  {/* Low LTV — % + max amount */}
                  <SurrogateBlock field="low_ltv" label="Low LTV Programme" color="sky" selfEmployed={selfEmployed} onSEChange={handleSEChange}>
                    <div className="ml-4 mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="relative">
                        <label className="block text-sm text-sky-700 mb-1">LTV Ratio (%)</label>
                        <CleanNumberInput value={selfEmployed.low_ltv_ratio}
                          onChange={(v) => handleSEChange('low_ltv_ratio', v)}
                          className="w-full px-3 py-2 border-2 border-sky-200 rounded-lg text-sm pr-7" placeholder="%" />
                        <span className="absolute right-3 bottom-2 text-sky-600 text-sm">%</span>
                      </div>
                      <div>
                        <label className="block text-sm text-sky-700 mb-1">Max Amount (₹)</label>
                        <CleanNumberInput value={selfEmployed.low_ltv_max_amount}
                          onChange={(v) => handleSEChange('low_ltv_max_amount', v)}
                          className="w-full px-3 py-2 border-2 border-sky-200 rounded-lg text-sm" placeholder="Max loan amount" />
                      </div>
                    </div>
                  </SurrogateBlock>

                  {/* FOIR — slab system */}
                  <div className={`rounded-lg border-2 transition-all p-3 ${selfEmployed.foir ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'}`}>
                    <Chk label="FOIR" checked={selfEmployed.foir} onChange={(e) => handleSEChange('foir', e.target.checked)} />
                    {selfEmployed.foir && (
                      <div className="ml-4 mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-semibold text-amber-800">Self-Employed FOIR Slabs</label>
                          <button type="button"
                            onClick={() => handleSEChange('se_foir_slabs', [...selfEmployed.se_foir_slabs, { income_range: 0, foir_gross: 0, foir_net: 0 }])}
                            className="text-xs px-3 py-1 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors">
                            + Add Slab
                          </button>
                        </div>
                        {selfEmployed.se_foir_slabs.map((slab, index) => (
                          <div key={index} className="mb-3 p-3 bg-white border border-amber-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-amber-700">Slab {index + 1}</span>
                              {selfEmployed.se_foir_slabs.length > 1 && (
                                <button type="button"
                                  onClick={() => handleSEChange('se_foir_slabs', selfEmployed.se_foir_slabs.filter((_, i) => i !== index))}
                                  className="text-xs text-red-500 hover:text-red-700">Remove</button>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-xs text-amber-700 mb-1">Income Range (₹)</label>
                                <CleanNumberInput value={slab.income_range}
                                  onChange={(v) => handleSEChange('se_foir_slabs', selfEmployed.se_foir_slabs.map((s, i) => i === index ? { ...s, income_range: v } : s))}
                                  className="w-full px-2 py-1.5 border border-amber-200 rounded text-xs" placeholder="Income" />
                              </div>
                              <div>
                                <label className="block text-xs text-amber-700 mb-1">FOIR Gross (%)</label>
                                <CleanNumberInput value={slab.foir_gross}
                                  onChange={(v) => handleSEChange('se_foir_slabs', selfEmployed.se_foir_slabs.map((s, i) => i === index ? { ...s, foir_gross: v } : s))}
                                  className="w-full px-2 py-1.5 border border-amber-200 rounded text-xs" placeholder="%" />
                              </div>
                              <div>
                                <label className="block text-xs text-amber-700 mb-1">FOIR Net (%)</label>
                                <CleanNumberInput value={slab.foir_net}
                                  onChange={(v) => handleSEChange('se_foir_slabs', selfEmployed.se_foir_slabs.map((s, i) => i === index ? { ...s, foir_net: v } : s))}
                                  className="w-full px-2 py-1.5 border border-amber-200 rounded text-xs" placeholder="%" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Combo */}
                  <div className={`rounded-lg border-2 transition-all p-3 ${selfEmployed.combo ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                    <Chk label="Combo" checked={selfEmployed.combo} onChange={(e) => handleSEChange('combo', e.target.checked)} />
                  </div>

                  {/* ABB Required */}
                  <div className={`rounded-lg border-2 transition-all p-3 ${selfEmployed.abb_required ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
                    <Chk label="ABB Required" checked={selfEmployed.abb_required} onChange={(e) => handleSEChange('abb_required', e.target.checked)} />
                    {selfEmployed.abb_required && (
                      <div className="ml-4 mt-2 max-w-xs relative">
                        <label className="block text-sm text-green-700 mb-1">ABB Ratio (%)</label>
                        <CleanNumberInput value={selfEmployed.abb_ratio}
                          onChange={(v) => handleSEChange('abb_ratio', v)}
                          className="w-full px-3 py-2 border-2 border-green-200 rounded-lg text-sm pr-7" placeholder="%" />
                        <span className="absolute right-3 bottom-2 text-green-600 text-sm">%</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>


              {/* ITR Required */}
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">How many ITR Required</label>
                <select value={selfEmployed.itr_required} onChange={(e) => handleSEChange('itr_required', e.target.value)}
                  className="w-full md:w-1/3 px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  <option value="1_year">Minimum 1 Year</option>
                  <option value="2_year">Minimum 2 Years</option>
                  <option value="3_year">Minimum 3 Years</option>
                </select>
              </div>

              {/* BCP */}
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Continuity Proof (BCP) - How many years old</label>
                <div className="max-w-xs">
                  <CleanNumberInput value={selfEmployed.bcp_years} onChange={(val) => handleSEChange('bcp_years', val)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm" placeholder="Enter years (e.g. 3)" />
                </div>
              </div>

              {/* Not Selected Texts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Not Selected Text 1</label>
                  <textarea value={selfEmployed.not_selected_text_1} onChange={(e) => handleSEChange('not_selected_text_1', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm" rows="3" placeholder="Explain why some options were not selected" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Not Selected Text 2</label>
                  <textarea value={selfEmployed.not_selected_text_2} onChange={(e) => handleSEChange('not_selected_text_2', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm" rows="3" placeholder="Optional additional note" />
                </div>
              </div>
            </div>
          )}

          {/* ── CIBIL POLICY ── */}
          {isCibilEnabled && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-6 uppercase tracking-wide">CIBIL Policy</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Minimum Score</label>
                  <CleanNumberInput value={cibil.min_score} onChange={(v) => handleCibilChange('min_score', v)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm" placeholder="Enter minimum CIBIL score" />
                </div>
                <div className="space-y-4">
                  <Chk label="Call Accepted" checked={cibil.call_accepted} onChange={(e) => handleCibilChange('call_accepted', e.target.checked)} />
                  <Chk label="Current Bounce Accepted" checked={cibil.current_bounce_accepted} onChange={(e) => handleCibilChange('current_bounce_accepted', e.target.checked)} />
                </div>
              </div>
              <div className="mt-6">
                <h5 className="text-base font-semibold text-gray-700 mb-3">Accepted Type</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {acceptedTypes.map((type) => (
                    <Chk key={type} label={type} checked={cibil.accepted_type.includes(type)} onChange={() => handleAcceptedTypeToggle(type)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USP Description */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wide">USP Description</h4>
            <textarea value={uspDescription} onChange={(e) => setUspDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm" rows="4" placeholder="Enter USP description..." />
          </div>
        </div>
      )}
    </div>
  );
};

export default Policy;