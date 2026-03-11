import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InsuranceSection from "../../components/admin/InsuranceSection";
import HomeLoan from "../../components/admin/HomeLoan";
import MortgageLoan from "../../components/admin/MortgageLoan";
import CommercialLoan from "../../components/admin/CommercialLoan";
import IndustrialLoan from "../../components/admin/IndustrialLoan";
import Tenor from "../../components/admin/Tenor";
import AgeLimit from "../../components/admin/AgeLimit";
import Policy from "../../components/admin/Policy";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CleanNumberInput from "../../components/admin/CleanNumberInput";
import { BACKENDDOMAIN } from "../../const/backenddomain";


const getInitialFormData = () => ({
  bank_details: {
    bank_name: "",

    bank_sm_name: "",
    bank_sm_contact_number: "",
    bank_rsm_name: "",
    bank_rsm_contact_number: ""
  },
  contact_number: "",
  home_loan: {
    home_loan: false,
    under_construction: false,
    ready_possession: false,
    resale: false,
    balance_transfer: false,
    balance_transfer_and_topup: false,
    plot_purchase: false,
    plot_plus_construction: false,
    pg: false,
    city_area: false,
    old_age_property: false,
    nir_home_loan: {
      salary_in_dollar: false,
      visa_type: ""
    },
    interest_rate: {
      salaried: { from: 0, to: 0, foir: 0 },
      non_salaried: { from: 0, to: 0, foir: 0 }
    },
    LTV: "",
    loan_ticket_size: { from: 0, to: 0 },
    layout_plan: 0,
    unit_plan: 0
  },
  mortgage_loan: {
    mortgage_loan: false,
    residential_self_occupied: false,
    residential_rented: false,
    residential_vacant: false,
    commercial_self_occupied: false,
    commercial_rented: false,
    commercial_vacant: false,
    industrial_self_occupied: false,
    industrial_rented: false,
    industrial_vacant: false,
    plot_residential: false,
    plot_commercial: false,
    plot_industrial: false,
    godown_self_occupied: false,
    godown_rented: false,
    godown_vacant: false,
    warehouse_self_occupied: false,
    warehouse_rented: false,
    warehouse_vacant: false,
    school_self_occupied: false,
    school_rented: false,
    pg_self_occupied: false,
    pg_rented: false,
    pg_vacant: false,
    hospital_self_occupied: false,
    hospital_rented: false,
    interest_rate: {
      salaried: { from: 0, to: 0, foir: 0 },
      non_salaried: { from: 0, to: 0, foir: 0 }
    },
    LTV: "",
    loan_ticket_size: { from: 0, to: 0 }
  },
  commercial_loan: {
    commercial_loan: false,
    under_construction: false,
    builder_purchase_ready: false,
    resale: false,
    interest_rate: {
      salaried: { from: 0, to: 0, foir: 0 },
      non_salaried: { from: 0, to: 0, foir: 0 }
    },
    LTV: "",
    loan_ticket_size: { from: 0, to: 0 }
  },
  industrial_loan: {
    industrial_loan: false,
    builder_purchase: false,
    resale: false,
    interest_rate: {
      salaried: { from: 0, to: 0, foir: 0 },
      non_salaried: { from: 0, to: 0, foir: 0 }
    },
    LTV: "",
    loan_ticket_size: { from: 0, to: 0 }
  },
  construction_finance_loan: false,
  cgtmse_loan: false,
  machinary_loan: false,
  login_fees: {
    login_salaried: 0,
    login_self_employed: 0
  },
  processing_fees: 0,
  insurance: {
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
  },
  tenor_salaried: { from: 0, to: 0 },
  tenor_self_employed: { from: 0, to: 0 },
  geo_limit: 0,
  age: {
    salaried: {
      min_age: 0,
      max_age: 0,
      extension_age_period: 0
    },
    self_employed: {
      min_age: 0,
      max_age: 0
    }
  },
  legal_charges: 0,
  valuation_charges: 0,
  extra_work: 0,
  extra_work_disbursement: [],
  parallel_funding: {
    enabled: false,
    stage_percentage: 0
  },
  margin_money: {
    required: false,
    ratio: 0
  },
  policy: {
    salaried: {
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
    },
    self_employed: {
      banking_surrogate: false,
      banking_surrogate_details: { dates: '', period: '6_month', foir_of_abb: 0, max_club_account: 0 },
      gst_surrogate: false,
      rtr_surrogate: false,
      industry_margin_surrogate: false,
      gross_profit_surrogate: false,
      lip: false,
      lip_details: { max_multiple: 0, foir: 0 },
      low_ltv: false,
      low_ltv_ratio: 0,
      foir: false,
      se_foir_slabs: [{ income_range: '', foir_gross: '', foir_net: '' }],
      combo: false,
      abb_required: false,
      abb_ratio: 0,
      dod: false,
      dod_details: { renewal_charges: false, renewal_charges_value: 0, renewal_charges_type: 'amount', utilization_ratio_quarterly: 0, turnover_ratio_applicable: false },
      itr_required: '2_year',
      bcp_years: 0,
      not_selected_text_1: "",
      not_selected_text_2: ""
    },
    cibil: {
      min_score: 0,
      call_accepted: false,
      accepted_type: [],
      current_bounce_accepted: false
    },
    usp_description: ""
  }
});

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { opacity: 0, y: -20 }
};

const CreateBank = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("bank-info");
  const [showChargeInputs, setShowChargeInputs] = useState({
    legal_charges: false,
    valuation_charges: false,
    extra_work: false,
    parallel_funding: false,
    login_fees: {
      login_salaried: false,
      login_self_employed: false
    },
    processing_fees: false
  });

  const handleChange = (key, data) => {
    setFormData((prev) => ({
      ...prev,
      [key]: data,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChargeChange = (name, value, isChecked) => {
    // Handle nested login_fees structure
    if (name.includes('login_fees.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: isChecked ? (typeof value === 'string' ? value : value.toString()) : 0
        }
      }));

      setShowChargeInputs(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: isChecked
        }
      }));
    } else {
      // Handle regular fields - keep as string if it's a string (decimal input)
      const newValue = isChecked ? (typeof value === 'string' ? value : value.toString()) : 0;

      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));

      setShowChargeInputs(prev => ({
        ...prev,
        [name]: isChecked
      }));
    }
  };

  const handleBankDetailsChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      bank_details: {
        ...prev.bank_details,
        [field]: value
      }
    }));
  };

  const handleDodChange = (field, value, isNested = false, nestedField = null) => {
    setFormData(prev => {
      const newPolicy = { ...prev.policy };
      const newSe = { ...newPolicy.self_employed };
      if (isNested) {
        newSe[field] = { ...newSe[field], [nestedField]: value };
      } else {
        newSe[field] = value;
      }
      newPolicy.self_employed = newSe;
      return { ...prev, policy: newPolicy };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Only proceed if we're on the policy section
    if (activeSection !== "policy") {
      return;
    }

    setIsSubmitting(true);
    formData.legal_charges= Number(formData.legal_charges) || 0
    formData.valuation_charges= Number(formData.valuation_charges) || 0
    formData.extra_work= Number(formData.extra_work) || 0
   formData.processing_fees= Number(formData.processing_fees) || 0
    formData.login_fees= {
        login_salaried: Number(formData.login_fees.login_salaried) || 0,
        login_self_employed: Number(formData.login_fees.login_self_employed) || 0
    }

    try {
      console.log(formData)
      const response = await axios.post(
        `${BACKENDDOMAIN}/api/v1/bank/createbank`,
        formData,

      );

      if (response.data.data.success) {
        toast.success("Bank profile created successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          onClose: () => navigate("/")
        });

        setTimeout(() => {
          alert("Bank updated successfully! You are being redirected to the home page.");
        }, 1000);

        setFormData(getInitialFormData());
      } else {
        throw new Error("Failed to create bank profile");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Something went wrong. Please try again later.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored"
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessingFeesChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      processing_fees: Number(value) || 0
    }));
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isSubmitting) {
        e.preventDefault();
        e.returnValue = 'Form submission is in progress. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSubmitting]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 relative overflow-hidden">
            <motion.div
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10"
            />
            <div className="relative z-10 text-center">
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-bold text-white tracking-tight"
              >
                Create New Bank Profile
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-2 text-blue-100 max-w-2xl mx-auto"
              >
                Complete all sections to register a new banking partner
              </motion.p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex overflow-x-auto px-6 -mb-px">
              {[
                { id: "bank-info", label: "Bank Info" },
                { id: "loans", label: "Loan Products" },
                { id: "insurance", label: "Insurance" },
                { id: "limits", label: "Limits & Tenor" },
                { id: "charges", label: "Charges" },
                { id: "policy", label: "Policies" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${activeSection === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                // Only allow Enter to submit on policy section
                if (activeSection === "policy") {
                  handleSubmit(e);
                } else {
                  // Move to next section on Enter press for other sections
                  const sections = ["bank-info", "loans", "insurance", "limits", "charges", "policy"];
                  const currentIndex = sections.indexOf(activeSection);
                  if (currentIndex < sections.length) {
                    setActiveSection(sections[currentIndex + 1]);
                  }
                }
              }
            }}
            className="p-6 space-y-8"
          >
            <AnimatePresence mode="wait">
              {/* Bank Info Section */}
              {activeSection === "bank-info" && (
                <motion.div
                  key="bank-info"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Bank Information
                    </h3>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank  Name
                      </label>
                      <input
                        type="text"
                        value={formData.bank_details.bank_name}
                        onChange={(e) => handleBankDetailsChange("bank_name", e.target.value)}
                        className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter Bank SM Name"
                      />
                    </motion.div>






                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank SM Name
                      </label>
                      <input
                        type="text"
                        value={formData.bank_details.bank_sm_name}
                        onChange={(e) => handleBankDetailsChange("bank_sm_name", e.target.value)}
                        className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter Bank SM Name"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank SM Contact Number
                      </label>
                      <input
                        type="text"
                        value={formData.bank_details.bank_sm_contact_number}
                        onChange={(e) => handleBankDetailsChange("bank_sm_contact_number", e.target.value)}
                        className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter SM Contact Number"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank RSM Name
                      </label>
                      <input
                        type="text"
                        value={formData.bank_details.bank_rsm_name}
                        onChange={(e) => handleBankDetailsChange("bank_rsm_name", e.target.value)}
                        className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter Bank RSM Name"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank RSM Contact Number
                      </label>
                      <input
                        type="text"
                        value={formData.bank_details.bank_rsm_contact_number}
                        onChange={(e) => handleBankDetailsChange("bank_rsm_contact_number", e.target.value)}
                        className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter RSM Contact Number"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Loans Section */}
              {activeSection === "loans" && (
                <motion.div
                  key="loans"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >

                  <HomeLoan
                    onChange={(data) => handleChange("home_loan", data)}
                    initialData={formData.home_loan}

                  />

                  <MortgageLoan
                    onChange={(data) => handleChange("mortgage_loan", data)}
                    initialData={formData.mortgage_loan}
                  />

                  {formData.mortgage_loan.mortgage_loan && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-white rounded-lg shadow-sm border border-amber-200 overflow-hidden p-6"
                    >
                      <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        DOD (Demand Overdraft) Options
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="dod_enabled_mortgage"
                            checked={formData.policy.self_employed.dod}
                            onChange={(e) => handleDodChange('dod', e.target.checked)}
                            className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 mr-2"
                          />
                          <label htmlFor="dod_enabled_mortgage" className="text-sm font-medium text-gray-700">
                            Enable DOD for this bank
                          </label>
                        </div>

                        {formData.policy.self_employed.dod && (
                          <div className="ml-6 space-y-6 pt-2 border-l-2 border-amber-100 pl-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="renewal_charges_dod"
                                checked={formData.policy.self_employed.dod_details.renewal_charges}
                                onChange={(e) => handleDodChange('dod_details', e.target.checked, true, 'renewal_charges')}
                                className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 mr-2"
                              />
                              <label htmlFor="renewal_charges_dod" className="text-sm font-medium text-gray-700">
                                Renewal Charges Applicable
                              </label>
                            </div>

                            {formData.policy.self_employed.dod_details.renewal_charges && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">Charge Type</label>
                                  <select
                                    value={formData.policy.self_employed.dod_details.renewal_charges_type}
                                    onChange={(e) => handleDodChange('dod_details', e.target.value, true, 'renewal_charges_type')}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-amber-500 focus:border-amber-500"
                                  >
                                    <option value="amount">Amount (₹)</option>
                                    <option value="percentage">Percentage (%)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-1">
                                    {formData.policy.self_employed.dod_details.renewal_charges_type === 'amount' ? 'Amount' : 'Percentage'}
                                  </label>
                                  <CleanNumberInput
                                    value={formData.policy.self_employed.dod_details.renewal_charges_value}
                                    onChange={(val) => handleDodChange('dod_details', val, true, 'renewal_charges_value')}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-amber-500 focus:border-amber-500"
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                            )}

                            <div className="max-w-xs">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Utilization Ratio Quarterly (%)</label>
                              <CleanNumberInput
                                value={formData.policy.self_employed.dod_details.utilization_ratio_quarterly}
                                onChange={(val) => handleDodChange('dod_details', val, true, 'utilization_ratio_quarterly')}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-amber-500 focus:border-amber-500"
                                placeholder="%"
                              />
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="turnover_ratio_applicable"
                                checked={formData.policy.self_employed.dod_details.turnover_ratio_applicable}
                                onChange={(e) => handleDodChange('dod_details', e.target.checked, true, 'turnover_ratio_applicable')}
                                className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 mr-2"
                              />
                              <label htmlFor="turnover_ratio_applicable" className="text-sm font-medium text-gray-700">
                                Turnover Ratio Applicable
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  <CommercialLoan
                    onChange={(data) => handleChange("commercial_loan", data)}
                    initialData={formData.commercial_loan}

                  />
                  <IndustrialLoan
                    onChange={(data) => handleChange("industrial_loan", data)}
                    initialData={formData.industrial_loan}

                  />

                  {/* Additional Loan Types */}
                  <motion.div
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
                    whileHover={{ y: -2 }}
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Other Loan Types
                      </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center"
                      >
                        <input
                          type="checkbox"
                          id="construction_finance_loan"
                          checked={formData.construction_finance_loan}
                          onChange={(e) => handleChange("construction_finance_loan", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                        />
                        <label htmlFor="construction_finance_loan" className="text-sm font-medium text-gray-700">
                          Construction Finance Loan
                        </label>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center"
                      >
                        <input
                          type="checkbox"
                          id="cgtmse_loan"
                          checked={formData.cgtmse_loan}
                          onChange={(e) => handleChange("cgtmse_loan", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                        />
                        <label htmlFor="cgtmse_loan" className="text-sm font-medium text-gray-700">
                          CGTMSE Loan
                        </label>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center"
                      >
                        <input
                          type="checkbox"
                          id="machinary_loan"
                          checked={formData.machinary_loan}
                          onChange={(e) => handleChange("machinary_loan", e.target.checked)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                        />
                        <label htmlFor="machinary_loan" className="text-sm font-medium text-gray-700">
                          Machinery Loan
                        </label>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Insurance Section */}
              {activeSection === "insurance" && (
                <motion.div
                  key="insurance"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <InsuranceSection
                    onChange={(data) => handleChange("insurance", data)}
                    initialData={formData.insurance}
                  />
                </motion.div>
              )}

              {/* Limits & Tenor Section */}
              {activeSection === "limits" && (
                <motion.div
                  key="limits"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <motion.div
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
                    whileHover={{ y: -2 }}
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Geographical Limit
                      </h3>
                    </div>
                    <div className="p-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Geo Limit Radius (in km) <span className="text-red-500">*</span>
                      </label>
                      <CleanNumberInput
                        name="geo_limit"
                        value={formData.geo_limit}
                        onChange={(value) => handleInputChange({
                          target: {
                            name: "geo_limit",
                            value: value
                          }
                        })}
                        className="block w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter radius in kilometers"
                        required
                      />
                    </div>
                  </motion.div>

                  <Tenor
                    onChange={(key, data) => handleChange(key, data)}
                    initialSalariedData={formData.tenor_salaried}
                    initialSelfEmployedData={formData.tenor_self_employed}
                  />
                  <AgeLimit
                    onChange={(data) => handleChange("age", data)}
                    initialData={formData.age}
                  />
                </motion.div>
              )}

              {/* Charges Section */}
              {activeSection === "charges" && (
                <motion.div
                  key="charges"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Legal & Other Charges
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      {[
                        { name: "legal_charges", label: "Legal Charges (₹)", required: true },
                        { name: "valuation_charges", label: "Valuation Charges (₹)", required: true },
                        { name: "processing_fees", label: "Processing Fees (₹)", required: true }
                      ].map((field, index) => (
                        <motion.div
                          key={field.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              checked={showChargeInputs[field.name]}
                              onChange={(e) => handleChargeChange(field.name, formData[field.name] || 0, e.target.checked)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                            />
                            <label className="text-sm font-medium text-gray-700">
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                          </div>
                          {showChargeInputs[field.name] && (
                            <CleanNumberInput
                              decimal // Add this line
                              value={formData[field.name]}
                              onChange={(value) => handleChargeChange(field.name, value, true)}
                              className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              placeholder='0'
                            />
                          )}
                        </motion.div>
                      ))}

                      {/* Login Fees - Salaried */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={showChargeInputs.login_fees.login_salaried}
                            onChange={(e) => handleChargeChange("login_fees.login_salaried", formData.login_fees.login_salaried || 0, e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                          />
                          <label className="text-sm font-medium text-gray-700">
                            Login Fees - Salaried (₹) <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {showChargeInputs.login_fees.login_salaried && (
                          <CleanNumberInput
                            value={formData.login_fees.login_salaried}
                            onChange={(value) => handleChargeChange("login_fees.login_salaried", value, true)}
                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Enter amount for salaried"
                            required
                          />
                        )}
                      </motion.div>

                      {/* Login Fees - Self Employed */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={showChargeInputs.login_fees.login_self_employed}
                            onChange={(e) => handleChargeChange("login_fees.login_self_employed", formData.login_fees.login_self_employed || 0, e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                          />
                          <label className="text-sm font-medium text-gray-700">
                            Login Fees - Self Employed (₹) <span className="text-red-500">*</span>
                          </label>
                        </div>
                        {showChargeInputs.login_fees.login_self_employed && (
                          <CleanNumberInput
                            value={formData.login_fees.login_self_employed}
                            onChange={(value) => handleChargeChange("login_fees.login_self_employed", value, true)}
                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Enter amount for self employed"
                            required
                          />
                        )}
                      </motion.div>

                      {/* Extra Work Field */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={showChargeInputs.extra_work}
                            onChange={(e) => handleChargeChange("extra_work", formData.extra_work || 0, e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                          />
                          <label className="text-sm font-medium text-gray-700">
                            Extra Work Required (%)
                          </label>
                        </div>
                        {showChargeInputs.extra_work && (
                          <CleanNumberInput
                            value={formData.extra_work}
                            onChange={(value) => handleChargeChange("extra_work", value, true)}
                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Enter percentage"
                            max="100"
                          />
                        )}
                      </motion.div>
                    </div>

                    {/* Extra Work Disbursement Tab */}
                    {showChargeInputs.extra_work && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <label className="block text-sm font-semibold text-blue-800 mb-3">
                          Extra Work Disbursement — Customer Account or 3rd Party Account
                        </label>
                        <div className="flex flex-wrap gap-4">
                          {[
                            { val: 'customer_account', label: 'Customer Account' },
                            { val: '3rd_party_account', label: '3rd Party Account' }
                          ].map(option => (
                            <label key={option.val} className={`flex items-center space-x-2 cursor-pointer px-4 py-3 rounded-lg border-2 transition-all ${(formData.extra_work_disbursement || []).includes(option.val) ? 'bg-blue-100 border-blue-500 text-blue-800' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                              <input
                                type="checkbox"
                                checked={(formData.extra_work_disbursement || []).includes(option.val)}
                                onChange={(e) => {
                                  const current = formData.extra_work_disbursement || [];
                                  const newValue = e.target.checked 
                                    ? [...current, option.val] 
                                    : current.filter(val => val !== option.val);
                                  setFormData(prev => ({ ...prev, extra_work_disbursement: newValue }));
                                }}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Parallel Funding - yes/no + stage % */}
                    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="parallel_funding_enabled"
                          checked={formData.parallel_funding.enabled}
                          onChange={(e) => setFormData(prev => ({ ...prev, parallel_funding: { ...prev.parallel_funding, enabled: e.target.checked, stage_percentage: e.target.checked ? prev.parallel_funding.stage_percentage : 0 } }))}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                        />
                        <label htmlFor="parallel_funding_enabled" className="text-sm font-semibold text-gray-700">Parallel Funding</label>
                      </div>
                      {formData.parallel_funding.enabled && (
                        <div className="max-w-xs ml-6">
                          <label className="block text-sm text-gray-600 mb-1">Stage (%)</label>
                          <div className="relative">
                            <CleanNumberInput
                              value={formData.parallel_funding.stage_percentage}
                              onChange={(val) => setFormData(prev => ({ ...prev, parallel_funding: { ...prev.parallel_funding, stage_percentage: val } }))}
                              className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-8"
                              placeholder="Stage %"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Margin Money */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="margin_money_required"
                          checked={formData.margin_money.required}
                          onChange={(e) => setFormData(prev => ({ ...prev, margin_money: { ...prev.margin_money, required: e.target.checked, ratio: e.target.checked ? prev.margin_money.ratio : 0 } }))}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                        />
                        <label htmlFor="margin_money_required" className="text-sm font-semibold text-gray-700">Margin Money Required</label>
                      </div>
                      {formData.margin_money.required && (
                        <div className="max-w-xs ml-6">
                          <label className="block text-sm text-gray-600 mb-1">Ratio (%)</label>
                          <div className="relative">
                            <CleanNumberInput
                              value={formData.margin_money.ratio}
                              onChange={(val) => setFormData(prev => ({ ...prev, margin_money: { ...prev.margin_money, ratio: val } }))}
                              className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-8"
                              placeholder="Ratio %"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Policy Section */}
              {activeSection === "policy" && (
                <motion.div
                  key="policy"
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Policy
                    onChange={(data) => handleChange("policy", data)}
                    initialData={formData.policy}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {/* Navigation Buttons */}
            <motion.div
              className="flex justify-between pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {activeSection !== "bank-info" && (
                <button
                  type="button"
                  onClick={() => {
                    const sections = ["bank-info", "loans", "insurance", "limits", "charges", "policy"];
                    const currentIndex = sections.indexOf(activeSection);
                    if (currentIndex > 0) {
                      setActiveSection(sections[currentIndex - 1]);
                    }
                  }}
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}

              {activeSection !== "policy" ? (
                <button
                  type="button"
                  onClick={() => {
                    const sections = ["bank-info", "loans", "insurance", "limits", "charges", "policy"];
                    const currentIndex = sections.indexOf(activeSection);
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1]);
                    }
                  }}
                  className="ml-auto flex items-center px-6 py-3 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  Next
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button" // ✅ DO NOT make it "submit" here directly
                  onClick={handleSubmit} // ✅ Explicitly call submit here
                  disabled={isSubmitting}
                  className={`ml-auto flex items-center px-8 py-3 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Submit Bank Profile
                    </>
                  )}
                </button>
              )}

            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateBank;