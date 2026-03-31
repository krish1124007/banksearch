import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import isEqual from 'lodash.isequal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKENDDOMAIN } from "../../const/backenddomain";

// ⚠️ MUST be outside the component — if defined inside, React creates a new
// component type on every render, causing unmount/remount → scroll jumps to top.
const SectionDropdown = ({ title, sectionKey, expandedSections, toggleSection, children }) => (
    <div className="mb-6 border border-blue-200 rounded-lg overflow-hidden">
        <button
            type="button"
            onClick={() => toggleSection(sectionKey)}
            className="w-full flex items-center justify-between px-6 py-4 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 text-left"
        >
            <h2 className="text-lg font-semibold text-blue-800">{title}</h2>
            <svg className={`w-5 h-5 text-blue-600 transition-transform duration-200 ${expandedSections[sectionKey] ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        {expandedSections[sectionKey] && (
            <div className="p-6 bg-white">{children}</div>
        )}
    </div>
);

const Inp = ({ label, value, path, type = 'text', onChange }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-blue-700 capitalize mb-1">{label.replace(/_/g, ' ')}:</label>
        <input type={type} value={value ?? ''} onChange={(e) => onChange(e, path)}
            className="block w-full rounded-md border border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2" />
    </div>
);

const Chk = ({ label, value, path, onChange }) => (
    <div className="flex items-center mb-2">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e, path)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2" />
        <label className="text-sm text-blue-800 capitalize">{label.replace(/_/g, ' ')}</label>
    </div>
);

const LoanSection = ({ loanType, title, bankData, expandedSections, toggleSection, handleChange, setBankData }) => {
    const data = bankData?.[loanType];
    if (!data) return null;
    const boolKeys = Object.keys(data).filter(k => typeof data[k] === 'boolean' && k !== '_id' && k !== '__v');
    const sd = { expandedSections, toggleSection };

    return (
        <SectionDropdown title={title} sectionKey={loanType} {...sd}>
            {/* General Info for this loan type */}
            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h3 className="text-md font-semibold text-indigo-700 mb-3">📋 General Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {boolKeys.map(k => <Chk key={k} label={k} value={data[k]} path={`${loanType}.${k}`} onChange={handleChange} />)}
                </div>
            </div>

            {/* Interest Rate */}
            {data.interest_rate && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <h3 className="text-md font-semibold text-blue-700 mb-3">📈 Interest Rate (ROI %)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-semibold text-blue-600 mb-2">Salaried</h4>
                            <Inp label="from %" value={data.interest_rate.salaried?.from} path={`${loanType}.interest_rate.salaried.from`} type="number" onChange={handleChange} />
                            <Inp label="to %" value={data.interest_rate.salaried?.to} path={`${loanType}.interest_rate.salaried.to`} type="number" onChange={handleChange} />
                            <Inp label="foir %" value={data.interest_rate.salaried?.foir} path={`${loanType}.interest_rate.salaried.foir`} type="number" onChange={handleChange} />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-blue-600 mb-2">Non-Salaried</h4>
                            <Inp label="from %" value={data.interest_rate.non_salaried?.from} path={`${loanType}.interest_rate.non_salaried.from`} type="number" onChange={handleChange} />
                            <Inp label="to %" value={data.interest_rate.non_salaried?.to} path={`${loanType}.interest_rate.non_salaried.to`} type="number" onChange={handleChange} />
                            <Inp label="foir %" value={data.interest_rate.non_salaried?.foir} path={`${loanType}.interest_rate.non_salaried.foir`} type="number" onChange={handleChange} />
                        </div>
                    </div>
                </div>
            )}

            {/* LTV */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h3 className="text-md font-semibold text-blue-700 mb-2">LTV</h3>
                <input type="text" value={data?.LTV || ''} onChange={(e) => handleChange(e, `${loanType}.LTV`)}
                    className="block w-full rounded-md border border-blue-300 p-2 text-sm" placeholder="e.g. 75% or 80:20" />
            </div>

            {/* Loan Ticket Size */}
            {data.loan_ticket_size && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <h3 className="text-md font-semibold text-blue-700 mb-2">Loan Ticket Size</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Inp label="from" value={data.loan_ticket_size?.from} path={`${loanType}.loan_ticket_size.from`} type="number" onChange={handleChange} />
                        <Inp label="to" value={data.loan_ticket_size?.to} path={`${loanType}.loan_ticket_size.to`} type="number" onChange={handleChange} />
                    </div>
                </div>
            )}

            {loanType === 'home_loan' && data.nir_home_loan && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <h3 className="text-md font-semibold text-blue-700 mb-2">NIR Home Loan</h3>
                    <Chk label="salary_in_dollar" value={data.nir_home_loan.salary_in_dollar} path="home_loan.nir_home_loan.salary_in_dollar" onChange={handleChange} />
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-blue-700 capitalize mb-1">Visa Type:</label>
                        <select 
                            value={data.nir_home_loan.visa_type || ''} 
                            onChange={(e) => handleChange(e, "home_loan.nir_home_loan.visa_type")}
                            className="block w-full rounded-md border border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
                        >
                            {['Student', 'Work', 'Tourist', 'Business', 'Permanent Resident', 'Other'].map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {loanType === 'mortgage_loan' && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <h3 className="text-md font-semibold text-amber-700 mb-3">💰 DOD (Demand Overdraft) Options</h3>
                    <div className="space-y-4">
                        <Chk label="Enable DOD" value={bankData.policy?.self_employed?.dod} path="policy.self_employed.dod" onChange={handleChange} />
                        {bankData.policy?.self_employed?.dod && (
                            <div className="ml-6 space-y-4 pt-2 border-l-2 border-amber-200 pl-4">
                                <div>
                                    <Chk label="Renewal Charges" value={bankData.policy.self_employed.dod_details?.renewal_charges} path="policy.self_employed.dod_details.renewal_charges" onChange={handleChange} />
                                    {bankData.policy.self_employed.dod_details?.renewal_charges && (
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <div>
                                                <label className="block text-xs font-medium text-amber-700 mb-1">Type:</label>
                                                <select 
                                                    value={bankData.policy.self_employed.dod_details?.renewal_charges_type || 'amount'}
                                                    onChange={(e) => setBankData(p => ({ ...p, policy: { ...p.policy, self_employed: { ...p.policy.self_employed, dod_details: { ...p.policy.self_employed.dod_details, renewal_charges_type: e.target.value } } } }))}
                                                    className="block w-full rounded-md border-amber-300 p-2 text-xs"
                                                >
                                                    <option value="amount">Amount (₹)</option>
                                                    <option value="percentage">Percentage (%)</option>
                                                </select>
                                            </div>
                                            <Inp label={bankData.policy.self_employed.dod_details?.renewal_charges_type === 'amount' ? 'Amount (₹)' : 'Percentage (%)'} 
                                                value={bankData.policy.self_employed.dod_details?.renewal_charges_value} 
                                                path="policy.self_employed.dod_details.renewal_charges_value" 
                                                type="number" onChange={handleChange} />
                                        </div>
                                    )}
                                </div>
                                <Inp label="Utilization Ratio Quarterly (%)" value={bankData.policy.self_employed.dod_details?.utilization_ratio_quarterly} path="policy.self_employed.dod_details.utilization_ratio_quarterly" type="number" onChange={handleChange} />
                                <Chk label="Turnover Ratio Applicable" value={bankData.policy.self_employed.dod_details?.turnover_ratio_applicable} path="policy.self_employed.dod_details.turnover_ratio_applicable" onChange={handleChange} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {loanType === 'home_loan' && (
                <div className="grid grid-cols-2 gap-4">
                    <Inp label="layout_plan" value={data.layout_plan} path="home_loan.layout_plan" type="number" onChange={handleChange} />
                    <Inp label="unit_plan" value={data.unit_plan} path="home_loan.unit_plan" type="number" onChange={handleChange} />
                </div>
            )}

            {/* DOD — shown only in Mortgage Loan */}
            {loanType === 'mortgage_loan' && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="text-md font-semibold text-amber-700 mb-3">📄 DOD (Demand Overdraft) Details</h3>
                    <Chk label="DOD Enabled" value={bankData?.policy?.self_employed?.dod} path="policy.self_employed.dod" onChange={handleChange} />
                    {bankData?.policy?.self_employed?.dod && (
                        <div className="ml-4 mt-3 space-y-3">
                            <Chk label="Renewal Charges" value={bankData?.policy?.self_employed?.dod_details?.renewal_charges} path="policy.self_employed.dod_details.renewal_charges" onChange={handleChange} />
                            {bankData?.policy?.self_employed?.dod_details?.renewal_charges && (
                                <div className="ml-4 grid grid-cols-2 gap-3">
                                    <Inp label="Renewal Charges Value" value={bankData?.policy?.self_employed?.dod_details?.renewal_charges_value} path="policy.self_employed.dod_details.renewal_charges_value" type="number" onChange={handleChange} />
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">Type:</label>
                                        <select value={bankData?.policy?.self_employed?.dod_details?.renewal_charges_type || 'amount'}
                                            onChange={(e) => setBankData(prev => ({ ...prev, policy: { ...prev.policy, self_employed: { ...prev.policy.self_employed, dod_details: { ...prev.policy.self_employed.dod_details, renewal_charges_type: e.target.value } } } }))}
                                            className="block w-full rounded-md border border-blue-300 p-2 text-sm">
                                            <option value="amount">Amount</option>
                                            <option value="percentage">Percentage</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                            <Inp label="Utilization Ratio Quarterly (%)" value={bankData?.policy?.self_employed?.dod_details?.utilization_ratio_quarterly} path="policy.self_employed.dod_details.utilization_ratio_quarterly" type="number" onChange={handleChange} />
                            <Chk label="Turnover Ratio Applicable" value={bankData?.policy?.self_employed?.dod_details?.turnover_ratio_applicable} path="policy.self_employed.dod_details.turnover_ratio_applicable" onChange={handleChange} />
                        </div>
                    )}
                </div>
            )}
        </SectionDropdown>
    );
};


const UpdateBank = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [bankData, setBankData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [originalBankData, setOriginalBankData] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        bank_details: false, login_fees: false, charges: false, tenor: false,
        home_loan: false, mortgage_loan: false, commercial_loan: false,
        industrial_loan: false, insurance: false, age: false, policy: false
    });

    useEffect(() => {
        if (location.state?.bank) {
            const data = JSON.parse(JSON.stringify(location.state.bank));
            // Normalize extra_work_disbursement to array if it's a string
            if (data.extra_work_disbursement && typeof data.extra_work_disbursement === 'string') {
                data.extra_work_disbursement = [data.extra_work_disbursement];
            } else if (!data.extra_work_disbursement) {
                data.extra_work_disbursement = [];
            }
            setBankData(data);
            setOriginalBankData(data);
        } else {
            setError("Bank data not provided. Please go back and select a bank to update.");
        }
    }, [location.state]);

    const toggleSection = (section) =>
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

    const handleChange = (e, path) => {
        const { value, type, checked } = e.target;
        const keys = path.split('.');
        setBankData(prev => {
            const newData = { ...prev };
            let cur = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                const k = keys[i];
                cur[k] = Array.isArray(cur[k]) ? [...cur[k]] : (typeof cur[k] === 'object' && cur[k] ? { ...cur[k] } : {});
                cur = cur[k];
            }
            const last = keys[keys.length - 1];
            cur[last] = type === 'checkbox' ? checked : type === 'number' ? (value === '' ? null : Number(value)) : type === 'array' ? value : value;
            return newData;
        });
    };

    const addSalariedFoirSlab = () => {
        setBankData(prev => {
            const newData = { ...prev };
            if (!newData.policy) newData.policy = {};
            if (!newData.policy.salaried) newData.policy.salaried = {};
            const sal = newData.policy.salaried;
            sal.foir_slabs = [...(sal.foir_slabs || []), { income_range: '', foir_gross: '', foir_net: '' }];
            return newData;
        });
    };

    const removeSalariedFoirSlab = (index) => {
        setBankData(prev => {
            const newData = { ...prev };
            const sal = newData.policy.salaried;
            sal.foir_slabs = sal.foir_slabs.filter((_, i) => i !== index);
            return newData;
        });
    };

    const addSeFoirSlab = () => {
        setBankData(prev => {
            const newData = { ...prev };
            if (!newData.policy) newData.policy = {};
            if (!newData.policy.self_employed) newData.policy.self_employed = {};
            const se = newData.policy.self_employed;
            se.se_foir_slabs = [...(se.se_foir_slabs || []), { income_range: '', foir_gross: '', foir_net: '' }];
            return newData;
        });
    };

    const removeSeFoirSlab = (index) => {
        setBankData(prev => {
            const newData = { ...prev };
            const se = newData.policy.self_employed;
            se.se_foir_slabs = se.se_foir_slabs.filter((_, i) => i !== index);
            return newData;
        });
    };

    const getUpdatePayload = () => {
        const updateBodyObject = {};
        const outerobjectvalues = {};
        const topKeys = ["processing_fees", "geo_limit", "legal_charges", "valuation_charges", "extra_work", "extra_work_disbursement", "additional_notes"];
        const nestedKeys = ["tenor_salaried", "tenor_self_employed", "parallel_funding", "margin_money"];
        const sectionKeys = ["home_loan", "mortgage_loan", "commercial_loan", "industrial_loan", "insurance", "age", "policy"];

        if (!isEqual(bankData.bank_details, originalBankData.bank_details)) outerobjectvalues.bank_details = bankData.bank_details;
        if (!isEqual(bankData.login_fees, originalBankData.login_fees)) outerobjectvalues.login_fees = bankData.login_fees;
        for (const k of topKeys) if (!isEqual(bankData[k], originalBankData[k])) outerobjectvalues[k] = bankData[k];
        for (const k of nestedKeys) if (!isEqual(bankData[k], originalBankData[k])) outerobjectvalues[k] = bankData[k];

        for (const key of sectionKeys) {
            if (!bankData[key] || !originalBankData[key]) continue;
            const changed = {};
            const findChanges = (orig, curr, acc) => {
                const allKeys = new Set([...Object.keys(orig || {}), ...Object.keys(curr || {})]);
                for (const p of allKeys) {
                    if (p === '_id' || p === '__v') continue;
                    const ov = orig?.[p], cv = curr?.[p];
                    if (typeof cv === 'object' && cv !== null && !Array.isArray(cv)) {
                        const nested = {};
                        findChanges(ov, cv, nested);
                        if (Object.keys(nested).length) acc[p] = { ...(acc[p] || {}), ...nested };
                    } else if (!isEqual(cv, ov)) acc[p] = cv;
                }
            };
            findChanges(originalBankData[key], bankData[key], changed);
            if (Object.keys(changed).length) {
                const nameMap = { home_loan: 'HomeLoan', mortgage_loan: 'MortgageLoan', commercial_loan: 'CommercialPurchase', industrial_loan: 'IndustrialPurchase', insurance: 'Insurance', age: 'AgeCriteria', policy: 'Policy' };
                updateBodyObject[nameMap[key]] = { id: originalBankData[key]._id, updateobject: changed };
            }
        }
        return { bankId: id, updateBodyObject, outerobjectvalues };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const payload = getUpdatePayload();
        if (!Object.keys(payload.updateBodyObject).length && !Object.keys(payload.outerobjectvalues).length) {
            setError("No changes detected.");
            setLoading(false);
            return;
        }
        try {
            await axios.post(`${BACKENDDOMAIN}/api/v1/bank/updatebank`, payload, { headers: { 'Content-Type': 'application/json' } });
            toast.success('Bank updated successfully!');
            navigate('/get-all-bank');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Update failed.');
        } finally {
            setLoading(false);
        }
    };

    const sd = { expandedSections, toggleSection };

    const sharedProps = { bankData, expandedSections, toggleSection, handleChange, setBankData };


    if (!bankData) return (
        <div className="p-6 bg-blue-50 min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-lg shadow p-6 border border-blue-100 max-w-md w-full">
                {loading && <p className="text-blue-700">Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Go Back</button>
            </div>
        </div>
    );

    const se = bankData?.policy?.self_employed || {};

    return (
        <div className="min-h-screen bg-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-100">
                    {/* Header with Back button */}
                    <div className="px-6 py-4 border-b border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center gap-4">
                        <button type="button" onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Update Bank Details</h1>
                            <p className="text-blue-100 text-sm mt-1">Click each section to expand and edit</p>
                        </div>
                    </div>

                    <div className="p-6">
                        {error && <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">{error}</div>}
                        <form onSubmit={handleSubmit}>

                            {/* Bank Details */}
                                <SectionDropdown title="🏦 Bank Details" sectionKey="bank_details" {...sd}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Inp label="bank_sm_name" value={bankData.bank_details?.bank_sm_name} path="bank_details.bank_sm_name" onChange={handleChange} />
                                    <Inp label="bank_sm_contact_number" value={bankData.bank_details?.bank_sm_contact_number} path="bank_details.bank_sm_contact_number" onChange={handleChange} />
                                    <Inp label="bank_rsm_name" value={bankData.bank_details?.bank_rsm_name} path="bank_details.bank_rsm_name" onChange={handleChange} />
                                    <Inp label="bank_rsm_contact_number" value={bankData.bank_details?.bank_rsm_contact_number} path="bank_details.bank_rsm_contact_number" onChange={handleChange} />
                                    {/* One Pager - full width */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-blue-700 mb-1">
                                            One Pager
                                            <span className="ml-2 text-xs text-gray-400 font-normal">(optional)</span>
                                        </label>
                                        <textarea
                                            rows={5}
                                            value={bankData.additional_notes || ""}
                                            onChange={(e) => setBankData(prev => ({ ...prev, additional_notes: e.target.value }))}
                                            className="block w-full rounded-md border border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 resize-y"
                                            placeholder="Enter any additional notes, special conditions, or remarks..."
                                        />
                                    </div>
                                </div>
                            </SectionDropdown>

                            {/* Login Fees */}
                            <SectionDropdown title="💳 Login Fees" sectionKey="login_fees" {...sd}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Inp label="login_salaried (₹)" value={bankData.login_fees?.login_salaried} path="login_fees.login_salaried" type="number" onChange={handleChange} />
                                    <Inp label="login_self_employed (₹)" value={bankData.login_fees?.login_self_employed} path="login_fees.login_self_employed" type="number" onChange={handleChange} />
                                </div>
                            </SectionDropdown>

                            {/* General Charges */}
                            <SectionDropdown title="ℹ️ Charges & Funding" sectionKey="charges" {...sd}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <Inp label="processing_fees (₹)" value={bankData.processing_fees} path="processing_fees" type="number" onChange={handleChange} />
                                    <Inp label="geo_limit" value={bankData.geo_limit} path="geo_limit" type="number" onChange={handleChange} />
                                    <Inp label="legal_charges (₹)" value={bankData.legal_charges} path="legal_charges" type="number" onChange={handleChange} />
                                    <Inp label="valuation_charges (₹)" value={bankData.valuation_charges} path="valuation_charges" type="number" onChange={handleChange} />
                                    <Inp label="extra_work (%)" value={bankData.extra_work} path="extra_work" type="number" onChange={handleChange} />
                                </div>
                                {(bankData.extra_work > 0) && (
                                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <label className="block text-sm font-semibold text-blue-800 mb-3">Extra Work Disbursement</label>
                                        <div className="flex gap-4">
                                            {[{ v: 'customer_account', l: 'Customer Account' }, { v: '3rd_party_account', l: '3rd Party Account' }].map(o => (
                                                <label key={o.v} className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg border-2 transition-all ${(bankData.extra_work_disbursement || []).includes(o.v) ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-200'}`}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={(bankData.extra_work_disbursement || []).includes(o.v)}
                                                        onChange={(e) => {
                                                            const current = bankData.extra_work_disbursement || [];
                                                            const newValue = e.target.checked 
                                                                ? [...current, o.v] 
                                                                : current.filter(item => item !== o.v);
                                                            setBankData(p => ({ ...p, extra_work_disbursement: newValue }));
                                                        }} 
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                                                    />
                                                    <span className="text-sm font-medium">{o.l}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <Chk label="Parallel Funding" value={bankData.parallel_funding?.enabled} path="parallel_funding.enabled" onChange={handleChange} />
                                    {bankData.parallel_funding?.enabled && (
                                        <div className="ml-6 relative max-w-xs">
                                            <Inp label="Stage %" value={bankData.parallel_funding?.stage_percentage} path="parallel_funding.stage_percentage" type="number" onChange={handleChange} />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <Chk label="Margin Money Required" value={bankData.margin_money?.required} path="margin_money.required" onChange={handleChange} />
                                    {bankData.margin_money?.required && (
                                        <div className="ml-6 max-w-xs">
                                            <Inp label="Ratio %" value={bankData.margin_money?.ratio} path="margin_money.ratio" type="number" onChange={handleChange} />
                                        </div>
                                    )}
                                </div>
                            </SectionDropdown>

                            {/* Tenor */}
                            <SectionDropdown title="📅 Tenor Details" sectionKey="tenor" {...sd}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                        <h3 className="font-medium text-blue-700 mb-3">Salaried Tenor</h3>
                                        <Inp label="from (months)" value={bankData.tenor_salaried?.from} path="tenor_salaried.from" type="number" onChange={handleChange} />
                                        <Inp label="to (months)" value={bankData.tenor_salaried?.to} path="tenor_salaried.to" type="number" onChange={handleChange} />
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                        <h3 className="font-medium text-blue-700 mb-3">Self-Employed Tenor</h3>
                                        <Inp label="from (months)" value={bankData.tenor_self_employed?.from} path="tenor_self_employed.from" type="number" onChange={handleChange} />
                                        <Inp label="to (months)" value={bankData.tenor_self_employed?.to} path="tenor_self_employed.to" type="number" onChange={handleChange} />
                                    </div>
                                </div>
                            </SectionDropdown>

                            {/* Loan Sections — each with its own general info */}
                            <LoanSection loanType="home_loan" title="🏠 Home Loan Details" {...sharedProps} />
                            <LoanSection loanType="mortgage_loan" title="🏗️ Mortgage Loan Details (+ DOD)" {...sharedProps} />
                            <LoanSection loanType="commercial_loan" title="🏢 Commercial Loan Details" {...sharedProps} />
                            <LoanSection loanType="industrial_loan" title="🏭 Industrial Loan Details" {...sharedProps} />

                            {/* Insurance */}
                            <SectionDropdown title="🛡️ Insurance Details" sectionKey="insurance" {...sd}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {bankData.insurance && ['life_insurance', 'property_insurance', 'health_insurance'].map(t => (
                                        bankData.insurance[t] && (
                                            <div key={t} className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                                <h3 className="font-medium text-blue-700 mb-3 capitalize">{t.replace(/_/g, ' ')}</h3>
                                                {Object.keys(bankData.insurance[t]).filter(k => typeof bankData.insurance[t][k] === 'boolean' && k !== '_id').map(k =>
                                                    <Chk key={k} label={k} value={bankData.insurance[t][k]} path={`insurance.${t}.${k}`} onChange={handleChange} />
                                                )}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </SectionDropdown>

                            {/* Age Criteria */}
                            <SectionDropdown title="🎂 Age Criteria" sectionKey="age" {...sd}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {bankData.age && ['salaried', 'self_employed'].map(at => (
                                        bankData.age[at] && (
                                            <div key={at} className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                                <h3 className="font-medium text-blue-700 mb-3 capitalize">{at.replace(/_/g, ' ')}</h3>
                                                <Inp label="min_age" value={bankData.age[at]?.min_age} path={`age.${at}.min_age`} type="number" onChange={handleChange} />
                                                <Inp label="max_age" value={bankData.age[at]?.max_age} path={`age.${at}.max_age`} type="number" onChange={handleChange} />
                                                {at === 'salaried' && <Inp label="extension_age_period" value={bankData.age[at]?.extension_age_period} path={`age.${at}.extension_age_period`} type="number" onChange={handleChange} />}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </SectionDropdown>

                            {/* Policy */}
                            <SectionDropdown title="📜 Policy Details" sectionKey="policy" {...sd}>
                                {bankData.policy && (
                                    <div className="space-y-6">
                                        {/* Salaried Policy */}
                                        {bankData.policy.salaried && (
                                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                                <h3 className="font-medium text-blue-700 mb-3">Salaried Policy</h3>
                                                <Chk label="cash_salary_accepted" value={bankData.policy.salaried?.cash_salary_accepted} path="policy.salaried.cash_salary_accepted" onChange={handleChange} />
                                                {bankData.policy.salaried.additional_income && (
                                                    <div className="mt-4 p-3 bg-white rounded border border-blue-100">
                                                        <h4 className="text-sm font-semibold text-blue-600 mb-2">Additional Income</h4>
                                                        {Object.keys(bankData.policy.salaried.additional_income).map(k =>
                                                            <Chk key={k} label={k} value={bankData.policy.salaried.additional_income[k]} path={`policy.salaried.additional_income.${k}`} onChange={handleChange} />
                                                        )}
                                                    </div>
                                                )}
                                                {bankData.policy.salaried.company_type && (
                                                    <div className="mt-4 p-3 bg-white rounded border border-blue-100">
                                                        <h4 className="text-sm font-semibold text-blue-600 mb-2">Company Type</h4>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                            {Object.keys(bankData.policy.salaried.company_type).map(k =>
                                                                <Chk key={k} label={k} value={bankData.policy.salaried.company_type[k]} path={`policy.salaried.company_type.${k}`} onChange={handleChange} />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                {bankData.policy.salaried.deduction && (
                                                    <div className="mt-4 p-3 bg-white rounded border border-blue-100">
                                                        <h4 className="text-sm font-semibold text-blue-600 mb-2">Deduction</h4>
                                                        {Object.keys(bankData.policy.salaried.deduction).map(k =>
                                                            <Chk key={k} label={k} value={bankData.policy.salaried.deduction[k]} path={`policy.salaried.deduction.${k}`} onChange={handleChange} />
                                                        )}
                                                    </div>
                                                )}
                                                <div className="mt-4 p-3 bg-white rounded border border-blue-100">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-sm font-semibold text-blue-600">FOIR Slabs</h4>
                                                        <button type="button" onClick={addSalariedFoirSlab}
                                                            className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                                            + Add Slab
                                                        </button>
                                                    </div>
                                                    {(bankData.policy.salaried.foir_slabs || []).map((slab, index) => (
                                                        <div key={index} className="mb-4 p-3 bg-gray-50 rounded border border-blue-50 relative">
                                                            <button type="button" onClick={() => removeSalariedFoirSlab(index)}
                                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                                <Inp label="Income Range" value={slab.income_range} path={`policy.salaried.foir_slabs.${index}.income_range`} type="number" onChange={handleChange} />
                                                                <Inp label="FOIR Gross %" value={slab.foir_gross} path={`policy.salaried.foir_slabs.${index}.foir_gross`} type="number" onChange={handleChange} />
                                                                <Inp label="FOIR Net %" value={slab.foir_net} path={`policy.salaried.foir_slabs.${index}.foir_net`} type="number" onChange={handleChange} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Self-Employed Policy */}
                                        {bankData.policy.self_employed && (
                                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                                <h3 className="font-medium text-blue-700 mb-4">Self-Employed Policy</h3>
                                                <div className="space-y-3">

                                                    {/* Banking Surrogate */}
                                                    <div className="p-3 bg-white rounded border border-gray-200">
                                                        <Chk label="Banking Surrogate" value={se.banking_surrogate} path="policy.self_employed.banking_surrogate" onChange={handleChange} />
                                                        {se.banking_surrogate && (
                                                            <div className="ml-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-blue-50 rounded">
                                                                <Inp label="Dates (comma-separated)" value={se.banking_surrogate_details?.dates} path="policy.self_employed.banking_surrogate_details.dates" onChange={handleChange} />
                                                                <div>
                                                                    <label className="block text-sm font-medium text-blue-700 mb-1">Period:</label>
                                                                    <select value={se.banking_surrogate_details?.period || '6_month'}
                                                                        onChange={(e) => setBankData(p => ({ ...p, policy: { ...p.policy, self_employed: { ...p.policy.self_employed, banking_surrogate_details: { ...p.policy.self_employed.banking_surrogate_details, period: e.target.value } } } }))}
                                                                        className="block w-full rounded-md border border-blue-300 p-2 text-sm">
                                                                        <option value="6_month">6 Months</option>
                                                                        <option value="9_month">9 Months</option>
                                                                        <option value="1_year">1 Year</option>
                                                                    </select>
                                                                </div>
                                                                <Inp label="FOIR of ABB (%)" value={se.banking_surrogate_details?.foir_of_abb} path="policy.self_employed.banking_surrogate_details.foir_of_abb" type="number" onChange={handleChange} />
                                                                <Inp label="Max Club Account" value={se.banking_surrogate_details?.max_club_account} path="policy.self_employed.banking_surrogate_details.max_club_account" type="number" onChange={handleChange} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* GST Surrogate */}
                                                    <div className="p-3 bg-white rounded border border-gray-200">
                                                        <Chk label="GST Surrogate" value={se.gst_surrogate} path="policy.self_employed.gst_surrogate" onChange={handleChange} />
                                                        {se.gst_surrogate && (
                                                            <div className="ml-4 mt-2 p-3 bg-blue-50 rounded">
                                                                <Inp label="GST Surrogate Ratio (%)" value={se.gst_surrogate_ratio} path="policy.self_employed.gst_surrogate_ratio" type="number" onChange={handleChange} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* RTR Surrogate */}
                                                    <div className="p-3 bg-white rounded border border-gray-200">
                                                        <Chk label="RTR Surrogate" value={se.rtr_surrogate} path="policy.self_employed.rtr_surrogate" onChange={handleChange} />
                                                        {se.rtr_surrogate && (
                                                            <div className="ml-4 mt-2 p-3 bg-blue-50 rounded">
                                                                <Inp label="RTR Surrogate Ratio (%)" value={se.rtr_surrogate_ratio} path="policy.self_employed.rtr_surrogate_ratio" type="number" onChange={handleChange} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Industry Margin Surrogate */}
                                                    <div className="p-3 bg-white rounded border border-gray-200">
                                                        <Chk label="Industry Margin Surrogate" value={se.industry_margin_surrogate} path="policy.self_employed.industry_margin_surrogate" onChange={handleChange} />
                                                        {se.industry_margin_surrogate && (
                                                            <div className="ml-4 mt-2 p-3 bg-blue-50 rounded">
                                                                <Inp label="Industry Margin Ratio (%)" value={se.industry_margin_surrogate_ratio} path="policy.self_employed.industry_margin_surrogate_ratio" type="number" onChange={handleChange} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Gross Profit Surrogate */}
                                                    <div className="p-3 bg-white rounded border border-gray-200">
                                                        <Chk label="Gross Profit Surrogate" value={se.gross_profit_surrogate} path="policy.self_employed.gross_profit_surrogate" onChange={handleChange} />
                                                        {se.gross_profit_surrogate && (
                                                            <div className="ml-4 mt-2 p-3 bg-blue-50 rounded">
                                                                <Inp label="Gross Profit Ratio (%)" value={se.gross_profit_surrogate_ratio} path="policy.self_employed.gross_profit_surrogate_ratio" type="number" onChange={handleChange} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* LIP */}
                                                    <div className="p-3 bg-white rounded border border-gray-200">
                                                        <Chk label="LIP" value={se.lip} path="policy.self_employed.lip" onChange={handleChange} />
                                                        {se.lip && (
                                                            <div className="ml-4 mt-2 grid grid-cols-2 gap-3 p-3 bg-blue-50 rounded">
                                                                <Inp label="Max Multiple" value={se.lip_details?.max_multiple} path="policy.self_employed.lip_details.max_multiple" type="number" onChange={handleChange} />
                                                                <Inp label="FOIR (%)" value={se.lip_details?.foir} path="policy.self_employed.lip_details.foir" type="number" onChange={handleChange} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Low LTV */}
                                                    <div className="p-3 bg-white rounded border border-gray-200">
                                                        <Chk label="Low LTV Programme" value={se.low_ltv} path="policy.self_employed.low_ltv" onChange={handleChange} />
                                                        {se.low_ltv && (
                                                            <div className="ml-4 mt-2 p-3 bg-blue-50 rounded max-w-xs">
                                                                <Inp label="Low LTV Ratio (%)" value={se.low_ltv_ratio} path="policy.self_employed.low_ltv_ratio" type="number" onChange={handleChange} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* ABB Required */}
                                                    <div className="p-3 bg-white rounded border border-gray-200">
                                                        <Chk label="ABB Required" value={se.abb_required} path="policy.self_employed.abb_required" onChange={handleChange} />
                                                        {se.abb_required && (
                                                            <div className="ml-4 mt-2 p-3 bg-blue-50 rounded max-w-xs">
                                                                <Inp label="ABB Ratio (%)" value={se.abb_ratio} path="policy.self_employed.abb_ratio" type="number" onChange={handleChange} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* FOIR & Combo */}
                                                    <div className="p-3 bg-white rounded border border-gray-200">
                                                        <Chk label="FOIR" value={se.foir} path="policy.self_employed.foir" onChange={handleChange} />
                                                        {se.foir && (
                                                            <div className="ml-4 mt-3 bg-amber-50 p-4 rounded-lg border border-amber-200">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <h4 className="text-sm font-semibold text-amber-800">FOIR Slabs</h4>
                                                                    <button type="button" onClick={addSeFoirSlab}
                                                                        className="text-xs px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors">
                                                                        + Add Slab
                                                                    </button>
                                                                </div>
                                                                {(se.se_foir_slabs || []).length === 0 && (
                                                                    <p className="text-xs text-amber-600 italic">No slabs added. Click "Add Slab" to start.</p>
                                                                )}
                                                                {(se.se_foir_slabs || []).map((slab, index) => (
                                                                    <div key={index} className="mb-4 p-3 bg-white rounded border border-amber-100 relative">
                                                                        <button type="button" onClick={() => removeSeFoirSlab(index)}
                                                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1">
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                            </svg>
                                                                        </button>
                                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                                            <Inp label="Income Range" value={slab.income_range} path={`policy.self_employed.se_foir_slabs.${index}.income_range`} type="number" onChange={handleChange} />
                                                                            <Inp label="FOIR Gross %" value={slab.foir_gross} path={`policy.self_employed.se_foir_slabs.${index}.foir_gross`} type="number" onChange={handleChange} />
                                                                            <Inp label="FOIR Net %" value={slab.foir_net} path={`policy.self_employed.se_foir_slabs.${index}.foir_net`} type="number" onChange={handleChange} />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Chk label="Combo" value={se.combo} path="policy.self_employed.combo" onChange={handleChange} />

                                                    {/* ITR Required */}
                                                    <div className="mt-2">
                                                        <label className="block text-sm font-medium text-blue-700 mb-1">ITR Required:</label>
                                                        <select value={se.itr_required || '2_year'}
                                                            onChange={(e) => setBankData(p => ({ ...p, policy: { ...p.policy, self_employed: { ...p.policy.self_employed, itr_required: e.target.value } } }))}
                                                            className="block w-48 rounded-md border border-blue-300 p-2 text-sm">
                                                            <option value="1_year">Min 1 Year</option>
                                                            <option value="2_year">Min 2 Years</option>
                                                            <option value="3_year">Min 3 Years</option>
                                                        </select>
                                                    </div>

                                                    {/* BCP Years */}
                                                    <div className="max-w-xs">
                                                        <Inp label="BCP Years (Business Continuity Proof)" value={se.bcp_years} path="policy.self_employed.bcp_years" type="number" onChange={handleChange} />
                                                    </div>

                                                    <Inp label="not_selected_text_1" value={se.not_selected_text_1} path="policy.self_employed.not_selected_text_1" onChange={handleChange} />
                                                    <Inp label="not_selected_text_2" value={se.not_selected_text_2} path="policy.self_employed.not_selected_text_2" onChange={handleChange} />
                                                </div>
                                            </div>
                                        )}

                                        {/* CIBIL Policy */}
                                        {bankData.policy.cibil && (
                                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                                <h3 className="font-medium text-blue-700 mb-3">CIBIL Policy</h3>
                                                <Inp label="min_score" value={bankData.policy.cibil?.min_score} path="policy.cibil.min_score" type="number" onChange={handleChange} />
                                                <Chk label="call_accepted" value={bankData.policy.cibil?.call_accepted} path="policy.cibil.call_accepted" onChange={handleChange} />
                                                <Chk label="current_bounce_accepted" value={bankData.policy.cibil?.current_bounce_accepted} path="policy.cibil.current_bounce_accepted" onChange={handleChange} />
                                                <Inp label="usp_description" value={bankData.policy.usp_description} path="policy.usp_description" onChange={handleChange} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </SectionDropdown>

                            <div className="flex justify-end gap-4 mt-8">
                                <button type="button" onClick={() => navigate(-1)}
                                    className="px-6 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading}
                                    className="px-6 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                                    {loading && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>}
                                    {loading ? 'Updating...' : 'Update Bank'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateBank;