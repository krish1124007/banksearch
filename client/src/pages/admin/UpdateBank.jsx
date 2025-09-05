import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import isEqual from 'lodash.isequal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKENDDOMAIN } from "../../const/backenddomain";


const UpdateBank = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [bankData, setBankData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [originalBankData, setOriginalBankData] = useState(null);

    useEffect(() => {
        if (location.state && location.state.bank) {
            setBankData(JSON.parse(JSON.stringify(location.state.bank)));
            setOriginalBankData(JSON.parse(JSON.stringify(location.state.bank)));
        } else {
            setError("Bank data not provided. Please go back and select a bank to update.");
        }
    }, [location.state]);

    const handleChange = (e, path) => {
        const { value, type, checked } = e.target;
        const keys = path.split('.');

        setBankData(prevData => {
            let newData = { ...prevData };
            let currentLevel = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!currentLevel[key] || typeof currentLevel[key] !== 'object' || Array.isArray(currentLevel[key])) {
                    currentLevel[key] = {};
                } else {
                    currentLevel[key] = { ...currentLevel[key] };
                }
                currentLevel = currentLevel[key];
            }

            const targetKey = keys[keys.length - 1];
            let newValue;
            if (type === 'checkbox') {
                newValue = checked;
            } else if (type === 'number') {
                newValue = value === '' ? null : Number(value);
            } else if (type === 'array') {
                newValue = value; // This is for handling array directly, like accepted_type
            } else {
                newValue = value;
            }

            currentLevel[targetKey] = newValue;
            return newData;
        });
    };

    const getUpdatePayload = () => {
        const updateBodyObject = {};
        const outerobjectvalues = {};
        const topLevelPrimitiveKeys = ["processing_fees", "geo_limit", "legal_charges", "valuation_charges", "extra_work", "parallel_funding"];
        const directNestedObjectKeys = ["tenor_salaried", "tenor_self_employed"];
        const majorSectionKeys = ["home_loan", "mortgage_loan", "commercial_loan", "industrial_loan", "insurance", "age", "policy"];

        // Handle bank_details changes
        if (originalBankData && bankData.bank_details && !isEqual(bankData.bank_details, originalBankData.bank_details)) {
            outerobjectvalues.bank_details = bankData.bank_details;
        }

        // Handle login_fees changes
        if (originalBankData && bankData.login_fees && !isEqual(bankData.login_fees, originalBankData.login_fees)) {
            outerobjectvalues.login_fees = bankData.login_fees;
        }

        for (const key of topLevelPrimitiveKeys) {
            if (originalBankData && !isEqual(bankData[key], originalBankData[key])) {
                outerobjectvalues[key] = bankData[key];
            }
        }

        for (const key of directNestedObjectKeys) {
            if (originalBankData && !isEqual(bankData[key], originalBankData[key])) {
                outerobjectvalues[key] = bankData[key];
            }
        }

        for (const key of majorSectionKeys) {
            if (bankData[key] && originalBankData && originalBankData[key]) {
                const updatedFields = {};
                const originalSubObject = originalBankData[key];
                const currentSubObject = bankData[key];

                const findDeepChanges = (orig, curr, changesAcc) => {
                    const allKeys = new Set([...Object.keys(orig || {}), ...Object.keys(curr || {})]);
                    for (const prop of allKeys) {
                        if (prop === '_id' || prop === '__v') continue;

                        const originalValue = orig ? orig[prop] : undefined;
                        const currentValue = curr ? curr[prop] : undefined;

                        if (typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue)) {
                            const nestedChanges = {};
                            findDeepChanges(originalValue, currentValue, nestedChanges);
                            if (Object.keys(nestedChanges).length > 0) {
                                changesAcc[prop] = { ...(changesAcc[prop] || {}), ...nestedChanges };
                            }
                        } else if (!isEqual(currentValue, originalValue)) {
                            changesAcc[prop] = currentValue;
                        }
                    }
                };

                findDeepChanges(originalSubObject, currentSubObject, updatedFields);

                // Special handling for interest_rate.foir
                if (['home_loan', 'mortgage_loan', 'commercial_loan', 'industrial_loan'].includes(key)) {
                    if (updatedFields.interest_rate?.salaried?.foir !== undefined) {
                        updatedFields.interest_rate.salaried = {
                            ...updatedFields.interest_rate.salaried,
                            foir: updatedFields.interest_rate.salaried.foir
                        };
                    }
                    if (updatedFields.interest_rate?.non_salaried?.foir !== undefined) {
                        updatedFields.interest_rate.non_salaried = {
                            ...updatedFields.interest_rate.non_salaried,
                            foir: updatedFields.interest_rate.non_salaried.foir
                        };
                    }
                }

                // Special handling for LTV and loan_ticket_size
                if (['home_loan', 'mortgage_loan', 'commercial_loan', 'industrial_loan'].includes(key)) {
                    if (updatedFields.LTV) {
                        updatedFields.LTV = {
                            from: updatedFields.LTV.from !== undefined ? updatedFields.LTV.from : currentSubObject.LTV?.from,
                            to: updatedFields.LTV.to !== undefined ? updatedFields.LTV.to : currentSubObject.LTV?.to
                        };
                    }
                    if (updatedFields.loan_ticket_size) {
                        updatedFields.loan_ticket_size = {
                            from: updatedFields.loan_ticket_size.from !== undefined ? updatedFields.loan_ticket_size.from : currentSubObject.loan_ticket_size?.from,
                            to: updatedFields.loan_ticket_size.to !== undefined ? updatedFields.loan_ticket_size.to : currentSubObject.loan_ticket_size?.to
                        };
                    }
                }

                // Specific handling for extension_age_period if it shouldn't be updated
                if (key === 'age' && updatedFields.self_employed && updatedFields.self_employed.extension_age_period !== undefined) {
                    delete updatedFields.self_employed.extension_age_period;
                }
                
                // Special handling for foir_slabs if it's an array and its contents have changed
                if (key === 'policy' && updatedFields.salaried?.foir_slabs) {
                    const originalFoirSlab = originalSubObject.salaried?.foir_slabs?.[0];
                    const currentFoirSlab = currentSubObject.salaried?.foir_slabs?.[0];
                    const foirSlabChanges = {};
                    if (!isEqual(currentFoirSlab?.income_range, originalFoirSlab?.income_range)) {
                        foirSlabChanges.income_range = currentFoirSlab?.income_range;
                    }
                    if (!isEqual(currentFoirSlab?.foir_gross, originalFoirSlab?.foir_gross)) {
                        foirSlabChanges.foir_gross = currentFoirSlab?.foir_gross;
                    }
                    if (!isEqual(currentFoirSlab?.foir_net, originalFoirSlab?.foir_net)) {
                        foirSlabChanges.foir_net = currentFoirSlab?.foir_net;
                    }
                    if (Object.keys(foirSlabChanges).length > 0) {
                        updatedFields.salaried.foir_slabs = [foirSlabChanges];
                    } else {
                        delete updatedFields.salaried.foir_slabs;
                    }
                }

                if (Object.keys(updatedFields).length > 0) {
                    let finalPayloadKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
                    if (key === 'commercial_loan') {
                        finalPayloadKey = 'CommercialPurchase';
                    } else if (key === 'industrial_loan') {
                        finalPayloadKey = 'IndustrialPurchase';
                    } else if (key === 'age') {
                        finalPayloadKey = 'AgeCriteria';
                    } else if (key === 'home_loan') {
                        finalPayloadKey = 'HomeLoan';
                    } else if (key === 'mortgage_loan') {
                        finalPayloadKey = 'MortgageLoan';
                    } else if (key === 'insurance') {
                        finalPayloadKey = 'Insurance';
                    } else if (key === 'policy') {
                        finalPayloadKey = 'Policy';
                    }

                    updateBodyObject[finalPayloadKey] = {
                        id: originalBankData[key]._id,
                        updateobject: updatedFields,
                    };
                }
            }
        }
        return { bankId: id, updateBodyObject, outerobjectvalues };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = getUpdatePayload();

        if (Object.keys(payload.updateBodyObject).length === 0 && Object.keys(payload.outerobjectvalues).length === 0) {
            setError("No changes detected to update.");
            setLoading(false);
            return;
        }
        console.log(payload);
        
        try {
            const response = await axios.post(`${BACKENDDOMAIN}/api/v1/bank/updatebank`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Bank updated successfully!');
            console.log('Update successful:', response.data);
            navigate('/get-all-bank');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Failed to update bank (Server Error)');
            } else if (err.request) {
                setError('Network Error: No response from server.');
            } else {
                setError(err.message || 'An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderBooleanField = (label, value, path) => (
        <div className="flex items-center mb-3">
            <input
                type="checkbox"
                id={`${path}-${label}`}
                name={label}
                checked={!!value}
                onChange={(e) => handleChange(e, path)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
            />
            <label htmlFor={`${path}-${label}`} className="ml-2 block text-sm text-blue-800 capitalize">
                {label.replace(/_/g, ' ')}
            </label>
        </div>
    );

    const renderInputField = (label, value, path, type = 'text') => (
        <div className="mb-4">
            <label htmlFor={`${path}-${label}`} className="block text-sm font-medium text-blue-700 capitalize">
                {label.replace(/_/g, ' ')}:
            </label>
            <input
                type={type}
                id={`${path}-${label}`}
                name={label}
                value={value === null || value === undefined ? '' : value}
                onChange={(e) => handleChange(e, path)}
                className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
        </div>
    );

    if (!bankData) {
        return (
            <div className="p-6 bg-blue-50 min-h-screen">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 border border-blue-100">
                    {loading && <p className="text-blue-700">Loading bank data...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && <p className="text-blue-700">No bank data found. Please navigate from the bank list.</p>}
                    <button
                        onClick={() => navigate('/banks')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        Go to Bank List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-blue-100">
                    <div className="px-6 py-4 border-b border-blue-200 bg-blue-50">
                        <h1 className="text-2xl font-bold text-blue-800">Update Bank Details</h1>
                    </div>

                    <div className="p-6">
                        {error && <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* Bank Details Section */}
                            <div className="mb-8 pb-6 border-b border-blue-200">
                                <h2 className="text-xl font-semibold text-blue-700 mb-4">Bank Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {renderInputField('bank_sm_name', bankData.bank_details?.bank_sm_name, 'bank_details.bank_sm_name')}
                                    {renderInputField('bank_sm_contact_number', bankData.bank_details?.bank_sm_contact_number, 'bank_details.bank_sm_contact_number')}
                                    {renderInputField('bank_rsm_name', bankData.bank_details?.bank_rsm_name, 'bank_details.bank_rsm_name')}
                                    {renderInputField('bank_rsm_contact_number', bankData.bank_details?.bank_rsm_contact_number, 'bank_details.bank_rsm_contact_number')}
                                </div>
                            </div>

                            {/* Login Fees Section */}
                            <div className="mb-8 pb-6 border-b border-blue-200">
                                <h2 className="text-xl font-semibold text-blue-700 mb-4">Login Fees</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {renderInputField('login_salaried', bankData.login_fees?.login_salaried, 'login_fees.login_salaried', 'number')}
                                    {renderInputField('login_self_employed', bankData.login_fees?.login_self_employed, 'login_fees.login_self_employed', 'number')}
                                </div>
                            </div>

                            {/* Other General Information */}
                            <div className="mb-8 pb-6 border-b border-blue-200">
                                <h2 className="text-xl font-semibold text-blue-700 mb-4">General Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {renderInputField('processing_fees', bankData.processing_fees, 'processing_fees', 'number')}
                                    {renderInputField('geo_limit', bankData.geo_limit, 'geo_limit', 'number')}
                                    {renderInputField('legal_charges', bankData.legal_charges, 'legal_charges', 'number')}
                                    {renderInputField('valuation_charges', bankData.valuation_charges, 'valuation_charges', 'number')}
                                    {renderInputField('extra_work', bankData.extra_work, 'extra_work', 'number')}
                                    {renderInputField('parallel_funding', bankData.parallel_funding, 'parallel_funding', 'number')}
                                </div>
                            </div>

                            {/* Tenor Details */}
                            <div className="mb-8 pb-6 border-b border-blue-200">
                                <h2 className="text-xl font-semibold text-blue-700 mb-4">Tenor Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                        <h3 className="text-lg font-medium text-blue-700 mb-3">Salaried Tenor</h3>
                                        {renderInputField('from', bankData.tenor_salaried?.from, 'tenor_salaried.from', 'number')}
                                        {renderInputField('to', bankData.tenor_salaried?.to, 'tenor_salaried.to', 'number')}
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                        <h3 className="text-lg font-medium text-blue-700 mb-3">Self-Employed Tenor</h3>
                                        {renderInputField('from', bankData.tenor_self_employed?.from, 'tenor_self_employed.from', 'number')}
                                        {renderInputField('to', bankData.tenor_self_employed?.to, 'tenor_self_employed.to', 'number')}
                                    </div>
                                </div>
                            </div>

                            {/* Loan Sections */}
                            {['home_loan', 'mortgage_loan', 'commercial_loan', 'industrial_loan'].map(loanType => (
                                <div key={loanType} className="mb-8 pb-6 border-b border-blue-200">
                                    <h2 className="text-xl font-semibold text-blue-700 mb-4 capitalize">{loanType.replace(/_/g, ' ')} Details</h2>
                                    {bankData[loanType] && (
                                        <div className="space-y-4">
                                            {bankData[loanType][loanType] !== undefined &&
                                                renderBooleanField(loanType, bankData[loanType][loanType], `${loanType}.${loanType}`)}

                                            {Object.keys(bankData[loanType]).filter(key =>
                                                typeof bankData[loanType][key] === 'boolean' && key !== loanType && key !== '_id' && key !== '__v'
                                            ).map(key =>
                                                renderBooleanField(key, bankData[loanType][key], `${loanType}.${key}`)
                                            )}

                                            {loanType === 'commercial_loan' && (
                                                bankData.commercial_loan.builder_purchase_ready !== undefined &&
                                                renderBooleanField('builder_purchase_ready', bankData.commercial_loan.builder_purchase_ready, `commercial_loan.builder_purchase_ready`)
                                            )}
                                            {loanType === 'industrial_loan' && (
                                                bankData.industrial_loan.builder_purchase !== undefined &&
                                                renderBooleanField('builder_purchase', bankData.industrial_loan.builder_purchase, `industrial_loan.builder_purchase`)
                                            )}

                                            {/* Interest Rate with FOIR */}
                                            {bankData[loanType].interest_rate && (
                                                <div className="mt-4 p-4 border rounded bg-blue-50 border-blue-100">
                                                    <h3 className="text-lg font-medium text-blue-700 mb-3">Interest Rate</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="text-md font-medium text-blue-600 mb-2">Salaried</h4>
                                                            {renderInputField('from', bankData[loanType].interest_rate.salaried?.from, `${loanType}.interest_rate.salaried.from`, 'number')}
                                                            {renderInputField('to', bankData[loanType].interest_rate.salaried?.to, `${loanType}.interest_rate.salaried.to`, 'number')}
                                                            {renderInputField('foir', bankData[loanType].interest_rate.salaried?.foir, `${loanType}.interest_rate.salaried.foir`, 'number')}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-md font-medium text-blue-600 mb-2">Non-Salaried</h4>
                                                            {renderInputField('from', bankData[loanType].interest_rate.non_salaried?.from, `${loanType}.interest_rate.non_salaried.from`, 'number')}
                                                            {renderInputField('to', bankData[loanType].interest_rate.non_salaried?.to, `${loanType}.interest_rate.non_salaried.to`, 'number')}
                                                            {renderInputField('foir', bankData[loanType].interest_rate.non_salaried?.foir, `${loanType}.interest_rate.non_salaried.foir`, 'number')}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* LTV Fields */}
                                            {bankData[loanType].LTV && (
                                                <div className="mt-4 p-4 border rounded bg-blue-50 border-blue-100">
                                                    <h3 className="text-lg font-medium text-blue-700 mb-3">Loan-to-Value (LTV)</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        {renderInputField('from', bankData[loanType].LTV?.from, `${loanType}.LTV.from`, 'number')}
                                                        {renderInputField('to', bankData[loanType].LTV?.to, `${loanType}.LTV.to`, 'number')}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Loan Ticket Size Fields */}
                                            {bankData[loanType].loan_ticket_size && (
                                                <div className="mt-4 p-4 border rounded bg-blue-50 border-blue-100">
                                                    <h3 className="text-lg font-medium text-blue-700 mb-3">Loan Ticket Size</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                        {renderInputField('from', bankData[loanType].loan_ticket_size?.from, `${loanType}.loan_ticket_size.from`, 'number')}
                                                        {renderInputField('to', bankData[loanType].loan_ticket_size?.to, `${loanType}.loan_ticket_size.to`, 'number')}
                                                    </div>
                                                </div>
                                            )}

                                            {loanType === 'home_loan' && bankData.home_loan.nir_home_loan && (
                                                <div className="mt-4 p-4 border rounded bg-blue-50 border-blue-100">
                                                    <h3 className="text-lg font-medium text-blue-700 mb-3">NIR Home Loan</h3>
                                                    {renderBooleanField('salary_in_dollar', bankData.home_loan.nir_home_loan.salary_in_dollar, `home_loan.nir_home_loan.salary_in_dollar`)}
                                                    {renderInputField('visa_type', bankData.home_loan.nir_home_loan.visa_type, `home_loan.nir_home_loan.visa_type`, 'text')}
                                                </div>
                                            )}

                                            {loanType === 'home_loan' && (
                                                <>
                                                    {renderInputField('layout_plan', bankData.home_loan.layout_plan, `home_loan.layout_plan`, 'number')}
                                                    {renderInputField('unit_plan', bankData.home_loan.unit_plan, `home_loan.unit_plan`, 'number')}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Insurance Section */}
                            <div className="mb-8 pb-6 border-b border-blue-200">
                                <h2 className="text-xl font-semibold text-blue-700 mb-4">Insurance Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {bankData.insurance && ['life_insurance', 'property_insurance', 'health_insurance'].map(insuranceType => (
                                        bankData.insurance[insuranceType] && (
                                            <div key={insuranceType} className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                                <h3 className="text-lg font-medium text-blue-700 mb-3 capitalize">{insuranceType.replace(/_/g, ' ')}</h3>
                                                {Object.keys(bankData.insurance[insuranceType]).filter(key =>
                                                    typeof bankData.insurance[insuranceType][key] === 'boolean' && key !== '_id' && key !== '__v'
                                                ).map(key =>
                                                    renderBooleanField(key, bankData.insurance[insuranceType][key], `insurance.${insuranceType}.${key}`)
                                                )}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* Age Criteria Section */}
                            <div className="mb-8 pb-6 border-b border-blue-200">
                                <h2 className="text-xl font-semibold text-blue-700 mb-4">Age Criteria</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {bankData.age && ['salaried', 'self_employed'].map(ageType => (
                                        bankData.age[ageType] && (
                                            <div key={ageType} className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                                <h3 className="text-lg font-medium text-blue-700 mb-3 capitalize">{ageType.replace(/_/g, ' ')}</h3>
                                                {renderInputField('min_age', bankData.age[ageType]?.min_age, `age.${ageType}.min_age`, 'number')}
                                                {renderInputField('max_age', bankData.age[ageType]?.max_age, `age.${ageType}.max_age`, 'number')}
                                                {ageType === 'salaried' && renderInputField('extension_age_period', bankData.age[ageType]?.extension_age_period, `age.${ageType}.extension_age_period`, 'number')}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* Policy Section */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-blue-700 mb-4">Policy Details</h2>
                                {bankData.policy && (
                                    <div className="space-y-6">
                                        {bankData.policy.salaried && (
                                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                                <h3 className="text-lg font-medium text-blue-700 mb-3">Salaried Policy</h3>
                                                {renderBooleanField('cash_salary_accepted', bankData.policy.salaried?.cash_salary_accepted, `policy.salaried.cash_salary_accepted`)}

                                                {bankData.policy.salaried.additional_income && (
                                                    <div className="mt-4 p-4 bg-white rounded border border-blue-100">
                                                        <h4 className="text-md font-medium text-blue-600 mb-2">Additional Income</h4>
                                                        {Object.keys(bankData.policy.salaried.additional_income).map(key =>
                                                            renderBooleanField(key, bankData.policy.salaried.additional_income[key], `policy.salaried.additional_income.${key}`)
                                                        )}
                                                    </div>
                                                )}

                                                {bankData.policy.salaried.company_type && (
                                                    <div className="mt-4 p-4 bg-white rounded border border-blue-100">
                                                        <h4 className="text-md font-medium text-blue-600 mb-2">Company Type</h4>
                                                        {Object.keys(bankData.policy.salaried.company_type).map(key =>
                                                            renderBooleanField(key, bankData.policy.salaried.company_type[key], `policy.salaried.company_type.${key}`)
                                                        )}
                                                    </div>
                                                )}

                                                {bankData.policy.salaried.deduction && (
                                                    <div className="mt-4 p-4 bg-white rounded border border-blue-100">
                                                        <h4 className="text-md font-medium text-blue-600 mb-2">Deduction</h4>
                                                        {Object.keys(bankData.policy.salaried.deduction).map(key =>
                                                            renderBooleanField(key, bankData.policy.salaried.deduction[key], `policy.salaried.deduction.${key}`)
                                                        )}
                                                    </div>
                                                )}

                                                {/* FOIR Slabs for Salaried */}
                                                {bankData.policy.salaried.foir_slabs && bankData.policy.salaried.foir_slabs.length > 0 && (
                                                    <div className="mt-4 p-4 bg-white rounded border border-blue-100">
                                                        <h4 className="text-md font-medium text-blue-600 mb-2">FOIR Slabs (First Slab)</h4>
                                                        {renderInputField('income_range', bankData.policy.salaried.foir_slabs[0]?.income_range, 'policy.salaried.foir_slabs.0.income_range')}
                                                        {renderInputField('foir_gross', bankData.policy.salaried.foir_slabs[0]?.foir_gross, 'policy.salaried.foir_slabs.0.foir_gross')}
                                                        {renderInputField('foir_net', bankData.policy.salaried.foir_slabs[0]?.foir_net, 'policy.salaried.foir_slabs.0.foir_net')}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {bankData.policy.self_employed && (
                                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                                <h3 className="text-lg font-medium text-blue-700 mb-3">Self-Employed Policy</h3>
                                                {Object.keys(bankData.policy.self_employed).filter(key =>
                                                    typeof bankData.policy.self_employed[key] === 'boolean' && key !== '_id' && key !== '__v'
                                                ).map(key =>
                                                    renderBooleanField(key, bankData.policy.self_employed[key], `policy.self_employed.${key}`)
                                                )}
                                                {renderInputField('not_selected_text_1', bankData.policy.self_employed.not_selected_text_1, `policy.self_employed.not_selected_text_1`)}
                                                {renderInputField('not_selected_text_2', bankData.policy.self_employed.not_selected_text_2, `policy.self_employed.not_selected_text_2`)}
                                            </div>
                                        )}

                                        {bankData.policy.cibil && (
                                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                                <h3 className="text-lg font-medium text-blue-700 mb-3">CIBIL Policy</h3>
                                                {renderInputField('min_score', bankData.policy.cibil?.min_score, `policy.cibil.min_score`, 'number')}
                                                {renderBooleanField('call_accepted', bankData.policy.cibil?.call_accepted, `policy.cibil.call_accepted`)}
                                                {renderBooleanField('current_bounce_accepted', bankData.policy.cibil?.current_bounce_accepted, `policy.cibil.current_bounce_accepted`)}

                                                {bankData.policy.cibil.accepted_type && (
                                                    <div className="mt-4 space-y-2">
                                                        <label className="block text-sm font-medium text-blue-700">Accepted Type:</label>
                                                        {bankData.policy.cibil.accepted_type.map((type, index) => (
                                                            <div key={index} className="flex items-center">
                                                                <input
                                                                    type="text"
                                                                    value={type}
                                                                    onChange={(e) => {
                                                                        const newTypes = [...(bankData.policy.cibil?.accepted_type || [])];
                                                                        newTypes[index] = e.target.value;
                                                                        handleChange({ target: { value: newTypes, type: 'array' } }, `policy.cibil.accepted_type`);
                                                                    }}
                                                                    className="block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {renderInputField('usp_description', bankData.policy.usp_description, `policy.usp_description`)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : 'Update Bank'}
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