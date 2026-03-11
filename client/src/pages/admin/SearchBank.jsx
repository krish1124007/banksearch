import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKENDDOMAIN } from "../../const/backenddomain";


const loanSubOptionsMap = {
  home_loan: [
    "under_construction",
    "ready",
    "resale",
    "balance_transfer",
    "balance_transfer_and_topup",
    "plot_purchase",
    "plot_plus_construction",
    "pg",
    "city_area",
    "old_age_property",
  ],
  mortgage_loan: [
    "residential_self_occupied",
    "residential_rented",
    "residential_vacant",
    "commercial_self_occupied",
    "commercial_rented",
    "commercial_vacant",
    "industrial_self_occupied",
    "industrial_rented",
    "industrial_vacant",
    "plot_residential",
    "plot_commercial",
    "plot_industrial",
    "godown_self_occupied",
    "godown_rented",
    "godown_vacant",
    "warehouse_self_occupied",
    "warehouse_rented",
    "warehouse_vacant",
    "school_self_occupied",
    "school_rented",
    "pg_self_occupied",
    "pg_rented",
    "pg_vacant",
    "hospital_self_occupied",
    "hospital_rented",
  ],
  commercial_loan: ["under_construction", "builder_purchase_ready", "resale"],
  industrial_loan: ["builder_purchase", "resale"],
  construction_finance_loan: [],
  cgtmse_loan: [],
  machinary_loan: []
};

const SearchBank = () => {
  // Removed name and mobile states
  const [loanType, setLoanType] = useState("home_loan");
  const [loanSubOption, setLoanSubOption] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  const [insuranceSubType, setInsuranceSubType] = useState("full");

  // Interest rate with from/to and employment type
  const [interestRate, setInterestRate] = useState({
    from: "",
    to: "",
    employmentType: "salaried",
  });

  const [geoLimit, setGeoLimit] = useState("");
  const [foir, setFoir] = useState({
    salaried: "",
    self_employed: "",
  });

  const [ltv, setLtv] = useState("");

  const [loanTicketSize, setLoanTicketSize] = useState({
    from: "",
    to: "",
  });
  // Tenor with from/to for both employment types
  const [tenorSalaried, setTenorSalaried] = useState({
    from: "",
    to: "",
  });
  const [tenorSelfEmployed, setTenorSelfEmployed] = useState({
    from: "",
    to: "",
  });

  // Age with from/to for both employment types
  const [ageSalaried, setAgeSalaried] = useState({
    from: "",
    to: "",
  });
  const [ageSelfEmployed, setAgeSelfEmployed] = useState({
    from: "",
    to: "",
  });

  const [legalCharges, setLegalCharges] = useState("");
  const [valuationCharges, setValuationCharges] = useState("");
  const [loginFees, setLoginFees] = useState({
    login_salaried: 0,
    login_self_employed: 0
  });
  const [extraWork, setExtraWork] = useState("");
  const [parallelFunding, setParallelFunding] = useState("");

  // Policy options
  const [policySalaried, setPolicySalaried] = useState({
    foir_slabs_income_range: "",
    foir_slabs_foir_gross: "",
    foir_slabs_foir_net: "",
    cashSalaryAccepted: false,
    additionalIncomeRent: false,
    additionalIncomeFutureRental: false,
    additionalIncomeIncentive: false,
    companyTypeMNC: false,
    companyTypeGovt: false,
    companyTypePvtLtd: false,
    companyTypeLLP: false,
    companyTypePartnership: false,
    companyTypeTrust: false,
    companyTypeIndividual: false,
    deductionPF: false,
    deductionPT: false,
    deductionNoDeduction: false,
  });
  const [policySelfEmployed, setPolicySelfEmployed] = useState({
    bankingSurrogate: false,
    gstSurrogate: false,
    rtrSurrogate: false,
    industryMarginSurrogate: false,
    grossProfitSurrogate: false,
    lip: false,
    lowLtv: false,
    foir: false,
    foir_slabs_income_range: "",
    foir_slabs_foir_gross: "",
    foir_slabs_foir_net: "",
    combo: false,
  });
  const [policyCibil, setPolicyCibil] = useState({
    minScore: "",
    callAccepted: false,
    acceptedTypeOld: false,
    acceptedTypeRecent: false,
    currentBounceAccepted: false,
  });

  const [bankResult, setBankResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    setBankResult(null);
    const payload = {};

    // Loan type and sub-option
    if (loanType == "cgtmse_loan" || loanType == "machinary_loan" || loanType == "construction_finance_loan") {
      payload[`${loanType}`] = true;
     }
    else {
      payload[`${loanType}.${loanType}`] = true;
      if (loanSubOption) {
        payload[`${loanType}.${loanSubOption}`] = true;
      }
    }

    // Interest rate with proper structure
    if (interestRate.from || interestRate.to) {
      const interestRateKey = `${loanType}.interest_rate.${interestRate.employmentType}`;
      if (interestRate.from) {
        payload[`${interestRateKey}.from`] = {
          $lte: parseFloat(interestRate.from),
        };

      }
      if (interestRate.to) {
        payload[`${interestRateKey}.to`] = {
          $gte: parseFloat(interestRate.to),
        };
      }
    }

    // Insurance
    if (insuranceType && insuranceSubType) {
      payload[`insurance.${insuranceType}.${insuranceSubType}`] = true;
    }

    // Tenor for salaried
    if (tenorSalaried.from || tenorSalaried.to) {
      if (tenorSalaried.from) {
        payload["tenor_salaried.from"] = { $lte: parseInt(tenorSalaried.from) };
      }
      if (tenorSalaried.to) {
        payload["tenor_salaried.to"] = { $gte: parseInt(tenorSalaried.to) };
      }
    }

    // Tenor for self employed
    if (tenorSelfEmployed.from || tenorSelfEmployed.to) {
      if (tenorSelfEmployed.from) {
        payload["tenor_self_employed.from"] = {
          $lte: parseInt(tenorSelfEmployed.from),
        };
      }
      if (tenorSelfEmployed.to) {
        payload["tenor_self_employed.to"] = {
          $gte: parseInt(tenorSelfEmployed.to),
        };
      }
    }

    // Age for salaried
    if (ageSalaried.from || ageSalaried.to) {
      if (ageSalaried.from) {
        payload["age_salaried.from"] = { $gte: parseInt(ageSalaried.from) };
      }
      if (ageSalaried.to) {
        payload["age_salaried.to"] = { $lte: parseInt(ageSalaried.to) };
      }
    }

    // Age for self employed
    if (ageSelfEmployed.from || ageSelfEmployed.to) {
      if (ageSelfEmployed.from) {
        payload["age_self_employed.from"] = {
          $lte: parseInt(ageSelfEmployed.from),
        };
      }
      if (ageSelfEmployed.to) {
        payload["age_self_employed.to"] = {
          $gte: parseInt(ageSelfEmployed.to),
        };
      }
    }

    if (geoLimit) {
      payload["geo_limit"] = { $gte: parseFloat(geoLimit) };
    }
    if (legalCharges) {
      payload["legal_charges"] = { $gte: parseFloat(legalCharges) };
    }
    if (valuationCharges) {
      payload["valuation_charges"] = { $gte: parseFloat(valuationCharges) };
    }
    if (loginFees.login_salaried) {
      payload["login_fees.login_salaried"] = { $lte: parseFloat(loginFees.login_salaried) };
    }
    if (loginFees.login_self_employed) {
      payload["login_fees.login_self_employed"] = { $lte: parseFloat(loginFees.login_self_employed) };
    }
    if (extraWork) {
      payload["extra_work"] = { $gte: parseFloat(extraWork) };
    }
    if (parallelFunding) {
      payload["parallel_funding"] = { $gte: parseFloat(parallelFunding) };
    }

    // Policy for Salaried
    if (policySalaried.foir_slabs_income_range) {
      payload["policy.salaried.foir_slabs.0.income_range"] = {
        $lte: parseFloat(policySalaried.foir_slabs_income_range),
      };
    }
    if (policySalaried.foir_slabs_foir_gross) {
      payload["policy.salaried.foir_slabs.0.foir_gross"] = {
        $lte: parseFloat(policySalaried.foir_slabs_foir_gross),
      };
    }
    if (policySalaried.foir_slabs_foir_net) {
      payload["policy.salaried.foir_slabs.0.foir_net"] = {
        $lte: parseFloat(policySalaried.foir_slabs_foir_net),
      };
    }
    if (policySalaried.cashSalaryAccepted) {
      payload["policy.salaried.cash_salary_accepted"] = true;
    }
    if (policySalaried.additionalIncomeRent) {
      payload["policy.salaried.additional_income.rent"] = true;
    }
    if (policySalaried.additionalIncomeFutureRental) {
      payload["policy.salaried.additional_income.future_rental"] = true;
    }
    if (policySalaried.additionalIncomeIncentive) {
      payload["policy.salaried.additional_income.incentive"] = true;
    }
    if (policySalaried.companyTypeMNC) {
      payload["policy.salaried.company_type.MNC"] = true;
    }
    if (policySalaried.companyTypeGovt) {
      payload["policy.salaried.company_type.Govt"] = true;
    }
    if (policySalaried.companyTypePvtLtd) {
      payload["policy.salaried.company_type.PvtLtd"] = true;
    }
    if (policySalaried.companyTypeLLP) {
      payload["policy.salaried.company_type.LLP"] = true;
    }
    if (policySalaried.companyTypePartnership) {
      payload["policy.salaried.company_type.Partnership"] = true;
    }
    if (policySalaried.companyTypeTrust) {
      payload["policy.salaried.company_type.Trust"] = true;
    }
    if (policySalaried.companyTypeIndividual) {
      payload["policy.salaried.company_type.Individual"] = true;
    }
    if (policySalaried.deductionPF) {
      payload["policy.salaried.deduction.PF"] = true;
    }
    if (policySalaried.deductionPT) {
      payload["policy.salaried.deduction.PT"] = true; // Changed to true for selection
    }
    if (policySalaried.deductionNoDeduction) {
      payload["policy.salaried.deduction.no_deduction"] = true;
    }

    // Policy for Self Employed
    if (policySelfEmployed.bankingSurrogate) {
      payload["policy.self_employed.banking_surrogate"] = true;
    }
    if (policySelfEmployed.gstSurrogate) {
      payload["policy.self_employed.gst_surrogate"] = true;
    }
    if (policySelfEmployed.rtrSurrogate) {
      payload["policy.self_employed.rtr_surrogate"] = true;
    }
    if (policySelfEmployed.industryMarginSurrogate) {
      payload["policy.self_employed.industry_margin_surrogate"] = true;
    }
    if (policySelfEmployed.grossProfitSurrogate) {
      payload["policy.self_employed.gross_profit_surrogate"] = true;
    }
    if (policySelfEmployed.lip) {
      payload["policy.self_employed.lip"] = true;
    }
    if (policySelfEmployed.lowLtv) {
      payload["policy.self_employed.low_ltv"] = true;
    }
    if (policySelfEmployed.foir) {
      payload["policy.self_employed.foir"] = true;
    }
    if (policySelfEmployed.foir_slabs_income_range) {
      payload["policy.self_employed.se_foir_slabs.0.income_range"] = {
        $lte: parseFloat(policySelfEmployed.foir_slabs_income_range),
      };
    }
    if (policySelfEmployed.foir_slabs_foir_gross) {
      payload["policy.self_employed.se_foir_slabs.0.foir_gross"] = {
        $lte: parseFloat(policySelfEmployed.foir_slabs_foir_gross),
      };
    }
    if (policySelfEmployed.foir_slabs_foir_net) {
      payload["policy.self_employed.se_foir_slabs.0.foir_net"] = {
        $lte: parseFloat(policySelfEmployed.foir_slabs_foir_net),
      };
    }
    if (policySelfEmployed.combo) {
      payload["policy.self_employed.combo"] = true;
    }
    // FOIR
    if (foir.salaried) {
      payload[`${loanType}.interest_rate.salaried.foir`] = { $gte: parseFloat(foir.salaried) };
    }
    if (foir.self_employed) {
      payload[`${loanType}.interest_rate.self_employed.foir`] = { $gte: parseFloat(foir.self_employed) };
    }

    if (ltv) {
      
        payload["LTV"] =  ltv ;
      
    }

    if (loanTicketSize.from || loanTicketSize.to) {
      if (loanTicketSize.from) {
        payload[`${loanType}.loan_ticket_size.from`] = parseFloat(
          loanTicketSize.from
        );
      }
      if (loanTicketSize.to) {
        payload[`${loanType}.loan_ticket_size.to`] = parseFloat(
          loanTicketSize.to
        );
      }
    }
    // Policy for CIBIL
    if (policyCibil.minScore) {
      payload["policy.cibil.min_score"] = {
        $gte: parseInt(policyCibil.minScore),
      };
    }
    if (policyCibil.callAccepted) {
      payload["policy.cibil.call_accepted"] = true;
    }
    if (policyCibil.acceptedTypeOld) {
      payload["policy.cibil.accepted_type"] = { $in: ["Old"] };
    }
    if (policyCibil.acceptedTypeRecent) {
      payload["policy.cibil.accepted_type"] = { $in: ["Recent"] };
    }
    if (policyCibil.acceptedTypeOld && policyCibil.acceptedTypeRecent) {
      payload["policy.cibil.accepted_type"] = { $in: ["Old", "Recent"] };
    }
    if (policyCibil.currentBounceAccepted) {
      payload["policy.cibil.current_bounce_accepted"] = true;
    }

    console.log("Payload to send to backend:", payload);

    try {
      const response = await axios.post(
        `${BACKENDDOMAIN}/api/v1/bank/searchbank`,
        payload
      );

      if (response.data.data.success) {
        const resultData = response.data.data.data;
        setBankResult(resultData);
        console.log(resultData);

        await handleSave(resultData);
      } else {
        alert("Failed to fetch bank details.");
      }
    } catch (error) {
      console.log("Error ", error);
      alert("Error fetching bank. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (bankData) => {
    console.log("Saving bank data:", bankData);
    if (!bankData || (Array.isArray(bankData) && bankData.length === 0)) {
      console.warn("No bank data to save.");
      return;
    }
    try {
      const saveData = {
        search_objects: bankData,
      };
      const saveResponse = await axios.post(
        `${BACKENDDOMAIN}/api/v1/user/save`,
        saveData
      );
      console.log(saveData);

      if (saveResponse.data.data.success) {
        console.log("Data saved successfully");
      } else {
        alert("Failed to save bank data.");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Error saving data.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100">
          <div className="text-center mb-8 relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
            <h2 className="text-3xl font-bold text-blue-800">Search Bank</h2>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <button
                onClick={() => navigate("/super-search")}
                className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <div className="mr-2 bg-white/20 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                Super Search
              </button>
            </div>
            <p className="mt-2 text-blue-600">
              Find the best loan options with advanced filtering
            </p>
          </div>

          <div className="space-y-8">
            {/* Personal Details section removed per user request */}

            {/* Loan Type Section */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Loan Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Loan Type
                  </label>
                  <select
                    value={loanType}
                    onChange={(e) => {
                      setLoanType(e.target.value);
                      setLoanSubOption("");
                    }}
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="home_loan">Home Loan</option>
                    <option value="mortgage_loan">Mortgage Loan</option>
                    <option value="commercial_loan">Commercial Loan</option>
                    <option value="industrial_loan">Industrial Loan</option>
                    <option value="construction_finance_loan">Construction finance loan</option>
                    <option value="cgtmse_loan">CGTMSE Loan</option>
                    <option value="machinary_loan">Machinary Loan</option>

                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Loan Sub Option
                  </label>
                  <select
                    value={loanSubOption}
                    onChange={(e) => setLoanSubOption(e.target.value)}
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select Option --</option>
                    {loanSubOptionsMap[loanType]?.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Interest Rate Section */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Interest Rate
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={interestRate.employmentType}
                    onChange={(e) =>
                      setInterestRate((prev) => ({
                        ...prev,
                        employmentType: e.target.value,
                      }))
                    }
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="salaried">Salaried</option>
                    <option value="self_employed">Self Employed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    From (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={interestRate.from}
                    onChange={(e) =>
                      setInterestRate((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    To (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={interestRate.to}
                    onChange={(e) =>
                      setInterestRate((prev) => ({
                        ...prev,
                        to: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              {/* FOIR Field */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  FOIR (%)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-blue-600 mb-1">
                      Salaried
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={foir.salaried}
                      onChange={(e) =>
                        setFoir((prev) => ({
                          ...prev,
                          salaried: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-600 mb-1">
                      Self Employed
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={foir.self_employed}
                      onChange={(e) =>
                        setFoir((prev) => ({
                          ...prev,
                          self_employed: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* LTV Fields */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  LTV 
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap4" >
                  
                  <input
                      type="text"
                      step="0.1"
                      className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={ltv}
                      onChange={(e) =>
                        setLtv(e.target.value)
                      }
                    />
                </div>
              
              </div>

              {/* Loan Ticket Size Fields */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Loan Ticket Size (₹)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-blue-600 mb-1">
                      From
                    </label>
                    <input
                      type="number"
                      className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={loanTicketSize.from}
                      onChange={(e) =>
                        setLoanTicketSize((prev) => ({
                          ...prev,
                          from: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-600 mb-1">
                      To
                    </label>
                    <input
                      type="number"
                      className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={loanTicketSize.to}
                      onChange={(e) =>
                        setLoanTicketSize((prev) => ({
                          ...prev,
                          to: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance Section */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Insurance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Insurance Type
                  </label>
                  <select
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value)}
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="life_insurance">Life Insurance</option>
                    <option value="property_insurance">
                      Property Insurance
                    </option>
                    <option value="health_insurance">Health Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Insurance Sub-Type
                  </label>
                  <select
                    value={insuranceSubType}
                    onChange={(e) => setInsuranceSubType(e.target.value)}
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="mandatory">Mandatory</option>
                    <option value="full">Full</option>
                    <option value="less_tensor">Less Tensor</option>
                    <option value="lumsum">Lumsum</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tenor Section */}
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Tenor (Years)
              </h3>
              <div className="space-y-6 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
                {/* Salaried Section */}
                <div>
                  <h4 className="text-md font-medium text-blue-700 mb-2">
                    Salaried
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <input
                      type="number"
                      placeholder="From"
                      className="w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={tenorSalaried.from}
                      onChange={(e) =>
                        setTenorSalaried((prev) => ({
                          ...prev,
                          from: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="To"
                      className="w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={tenorSalaried.to}
                      onChange={(e) =>
                        setTenorSalaried((prev) => ({
                          ...prev,
                          to: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Self Employed Section */}
                <div>
                  <h4 className="text-md font-medium text-blue-700 mb-2">
                    Self Employed
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <input
                      type="number"
                      placeholder="From"
                      className="w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={tenorSelfEmployed.from}
                      onChange={(e) =>
                        setTenorSelfEmployed((prev) => ({
                          ...prev,
                          from: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="To"
                      className="w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={tenorSelfEmployed.to}
                      onChange={(e) =>
                        setTenorSelfEmployed((prev) => ({
                          ...prev,
                          to: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Age Section */}
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Age (Years)
              </h3>
              <div className="space-y-6 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
                {/* Salaried */}
                <div>
                  <h4 className="text-md font-medium text-blue-700 mb-2">
                    Salaried
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <input
                      type="number"
                      placeholder="From"
                      className="w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={ageSalaried.from}
                      onChange={(e) =>
                        setAgeSalaried((prev) => ({
                          ...prev,
                          from: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="To"
                      className="w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={ageSalaried.to}
                      onChange={(e) =>
                        setAgeSalaried((prev) => ({
                          ...prev,
                          to: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Self Employed */}
                <div>
                  <h4 className="text-md font-medium text-blue-700 mb-2">
                    Self Employed
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                    <input
                      type="number"
                      placeholder="From"
                      className="w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={ageSelfEmployed.from}
                      onChange={(e) =>
                        setAgeSelfEmployed((prev) => ({
                          ...prev,
                          from: e.target.value,
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="To"
                      className="w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={ageSelfEmployed.to}
                      onChange={(e) =>
                        setAgeSelfEmployed((prev) => ({
                          ...prev,
                          to: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Charges Section */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Charges & Fees
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Legal Charges (₹)
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={legalCharges}
                    onChange={(e) => setLegalCharges(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Valuation Charges (₹)
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={valuationCharges}
                    onChange={(e) => setValuationCharges(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Login Fees (₹)
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={loginFees.login_self_employed}
                    onChange={(e) => setLoginFees((prev) => ({
                      ...prev,
                      login_self_employed: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Login Fees (salaried) (₹)
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={loginFees.login_salaried}
                    onChange={(e) => setLoginFees((prev) => ({
                      ...prev,
                      login_salaried: e.target.value
                    }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Extra Work (₹)
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={extraWork}
                    onChange={(e) => setExtraWork(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Parallel Funding (₹)
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={parallelFunding}
                    onChange={(e) => setParallelFunding(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Geo Limit (km)
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={geoLimit}
                    onChange={(e) => setGeoLimit(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Policy Section */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Policy Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Salaried Policy */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                  <h4 className="text-md font-medium text-blue-700 mb-3 pb-2 border-b border-blue-200">
                    Salaried Policy
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        FOIR Slabs:
                      </label>
                      <input
                        type="number"
                        placeholder="Income Range"
                        className="block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                        value={policySalaried.foir_slabs_income_range}
                        onChange={(e) =>
                          setPolicySalaried((prev) => ({
                            ...prev,
                            foir_slabs_income_range: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="number"
                        placeholder="FOIR Gross"
                        className="block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                        value={policySalaried.foir_slabs_foir_gross}
                        onChange={(e) =>
                          setPolicySalaried((prev) => ({
                            ...prev,
                            foir_slabs_foir_gross: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="number"
                        placeholder="FOIR Net"
                        className="block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={policySalaried.foir_slabs_foir_net}
                        onChange={(e) =>
                          setPolicySalaried((prev) => ({
                            ...prev,
                            foir_slabs_foir_net: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.cashSalaryAccepted}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              cashSalaryAccepted: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">Cash Salary Accepted</span>
                      </label>
                    </div>

                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <h5 className="text-sm font-medium text-blue-700 mb-2">
                        Additional Income:
                      </h5>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.additionalIncomeRent}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              additionalIncomeRent: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">Rent</span>
                      </label>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.additionalIncomeFutureRental}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              additionalIncomeFutureRental: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">Future Rental</span>
                      </label>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.additionalIncomeIncentive}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              additionalIncomeIncentive: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">Incentive</span>
                      </label>
                    </div>

                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <h5 className="text-sm font-medium text-blue-700 mb-2">
                        Company Type:
                      </h5>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.companyTypeMNC}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              companyTypeMNC: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">MNC</span>
                      </label>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.companyTypeGovt}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              companyTypeGovt: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">Govt</span>
                      </label>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.companyTypePvtLtd}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              companyTypePvtLtd: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">PvtLtd</span>
                      </label>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.companyTypeLLP}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              companyTypeLLP: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">LLP</span>
                      </label>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.companyTypePartnership}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              companyTypePartnership: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">Partnership</span>
                      </label>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.companyTypeTrust}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              companyTypeTrust: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">Trust</span>
                      </label>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.companyTypeIndividual}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              companyTypeIndividual: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">Individual</span>
                      </label>
                    </div>

                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <h5 className="text-sm font-medium text-blue-700 mb-2">
                        Deduction:
                      </h5>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.deductionPF}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              deductionPF: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">PF</span>
                      </label>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.deductionPT}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              deductionPT: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">PT</span>
                      </label>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policySalaried.deductionNoDeduction}
                          onChange={(e) =>
                            setPolicySalaried((prev) => ({
                              ...prev,
                              deductionNoDeduction: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">No Deduction</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Self Employed Policy */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                  <h4 className="text-md font-medium text-blue-700 mb-3 pb-2 border-b border-blue-200">
                    Self Employed Policy
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center text-sm text-blue-700 py-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                        checked={policySelfEmployed.bankingSurrogate}
                        onChange={(e) =>
                          setPolicySelfEmployed((prev) => ({
                            ...prev,
                            bankingSurrogate: e.target.checked,
                          }))
                        }
                      />
                      <span className="ml-2">Banking Surrogate</span>
                    </label>
                    <label className="flex items-center text-sm text-blue-700 py-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                        checked={policySelfEmployed.gstSurrogate}
                        onChange={(e) =>
                          setPolicySelfEmployed((prev) => ({
                            ...prev,
                            gstSurrogate: e.target.checked,
                          }))
                        }
                      />
                      <span className="ml-2">GST Surrogate</span>
                    </label>
                    <label className="flex items-center text-sm text-blue-700 py-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                        checked={policySelfEmployed.rtrSurrogate}
                        onChange={(e) =>
                          setPolicySelfEmployed((prev) => ({
                            ...prev,
                            rtrSurrogate: e.target.checked,
                          }))
                        }
                      />
                      <span className="ml-2">RTR Surrogate</span>
                    </label>
                    <label className="flex items-center text-sm text-blue-700 py-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                        checked={policySelfEmployed.industryMarginSurrogate}
                        onChange={(e) =>
                          setPolicySelfEmployed((prev) => ({
                            ...prev,
                            industryMarginSurrogate: e.target.checked,
                          }))
                        }
                      />
                      <span className="ml-2">Industry Margin Surrogate</span>
                    </label>
                    <label className="flex items-center text-sm text-blue-700 py-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                        checked={policySelfEmployed.grossProfitSurrogate}
                        onChange={(e) =>
                          setPolicySelfEmployed((prev) => ({
                            ...prev,
                            grossProfitSurrogate: e.target.checked,
                          }))
                        }
                      />
                      <span className="ml-2">Gross Profit Surrogate</span>
                    </label>
                    <label className="flex items-center text-sm text-blue-700 py-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                        checked={policySelfEmployed.lip}
                        onChange={(e) =>
                          setPolicySelfEmployed((prev) => ({
                            ...prev,
                            lip: e.target.checked,
                          }))
                        }
                      />
                      <span className="ml-2">LIP</span>
                    </label>
                    <label className="flex items-center text-sm text-blue-700 py-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                        checked={policySelfEmployed.lowLtv}
                        onChange={(e) =>
                          setPolicySelfEmployed((prev) => ({
                            ...prev,
                            lowLtv: e.target.checked,
                          }))
                        }
                      />
                      <span className="ml-2">Low LTV</span>
                    </label>
                    <label className="flex items-center text-sm text-blue-700 py-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                        checked={policySelfEmployed.foir}
                        onChange={(e) =>
                          setPolicySelfEmployed((prev) => ({
                            ...prev,
                            foir: e.target.checked,
                          }))
                        }
                      />
                      <span className="ml-2">FOIR</span>
                    </label>
                    <label className="flex items-center text-sm text-blue-700 py-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                        checked={policySelfEmployed.combo}
                        onChange={(e) =>
                          setPolicySelfEmployed((prev) => ({
                            ...prev,
                            combo: e.target.checked,
                          }))
                        }
                      />
                      <span className="ml-2">Combo</span>
                    </label>

                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        FOIR Price Slabs:
                      </label>
                      <input
                        type="number"
                        placeholder="Income Range"
                        className="block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                        value={policySelfEmployed.foir_slabs_income_range}
                        onChange={(e) =>
                          setPolicySelfEmployed((prev) => ({
                            ...prev,
                            foir_slabs_income_range: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="number"
                        placeholder="FOIR Gross"
                        className="block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                        value={policySelfEmployed.foir_slabs_foir_gross}
                        onChange={(e) =>
                          setPolicySelfEmployed((prev) => ({
                            ...prev,
                            foir_slabs_foir_gross: e.target.value,
                          }))
                        }
                      />
                      <input
                        type="number"
                        placeholder="FOIR Net"
                        className="block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={policySelfEmployed.foir_slabs_foir_net}
                        onChange={(e) =>
                          setPolicySelfEmployed((prev) => ({
                            ...prev,
                            foir_slabs_foir_net: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* CIBIL Policy */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                  <h4 className="text-md font-medium text-blue-700 mb-3 pb-2 border-b border-blue-200">
                    CIBIL Policy
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Minimum CIBIL Score
                      </label>
                      <input
                        type="number"
                        className="block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={policyCibil.minScore}
                        onChange={(e) =>
                          setPolicyCibil((prev) => ({
                            ...prev,
                            minScore: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policyCibil.callAccepted}
                          onChange={(e) =>
                            setPolicyCibil((prev) => ({
                              ...prev,
                              callAccepted: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">Call Accepted</span>
                      </label>
                    </div>

                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <h5 className="text-sm font-medium text-blue-700 mb-2">
                        Accepted Type:
                      </h5>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policyCibil.acceptedTypeOld}
                          onChange={(e) =>
                            setPolicyCibil((prev) => ({
                              ...prev,
                              acceptedTypeOld: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">Old</span>
                      </label>
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policyCibil.acceptedTypeRecent}
                          onChange={(e) =>
                            setPolicyCibil((prev) => ({
                              ...prev,
                              acceptedTypeRecent: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">Recent</span>
                      </label>
                    </div>

                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <label className="flex items-center text-sm text-blue-700 py-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                          checked={policyCibil.currentBounceAccepted}
                          onChange={(e) =>
                            setPolicyCibil((prev) => ({
                              ...prev,
                              currentBounceAccepted: e.target.checked,
                            }))
                          }
                        />
                        <span className="ml-2">Current Bounce Accepted</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer ${isLoading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
              >
                {isLoading ? (
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
                    Searching...
                  </>
                ) : (
                  "Search Banks"
                )}
              </button>

              {isLoading && (
                <div className="mt-6 text-center">
                  <p className="text-blue-600">
                    Searching for matching banks...
                  </p>
                </div>
              )}

              {bankResult && Array.isArray(bankResult) && (
                <div className="mt-10 bg-white rounded-xl shadow-lg p-6 border border-blue-100">
                  <h3 className="text-2xl font-bold text-blue-800 mb-6 border-b border-blue-200 pb-2">
                    🏦 Matching Banks
                  </h3>
                  <ul className="space-y-4">
                    {bankResult.map((bank, idx) => (
                      <li
                        key={bank._id || idx}
                        className="bg-blue-50 hover:bg-blue-100 transition duration-200 ease-in-out rounded-lg px-4 py-3 shadow-sm border border-blue-200 cursor-pointer"
                        onClick={() =>
                          navigate(`/bank/${bank._id}`, { state: { bank } })
                        }
                      >
                        <p className="text-lg font-semibold text-blue-800">
                          {bank.bank_details.bank_name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {bankResult && bankResult.length === 0 && !isLoading && (
                <div className="mt-10 bg-white rounded-xl shadow-lg p-6 text-center text-blue-700 border border-blue-100">
                  <p className="text-lg font-semibold">
                    No banks found matching your criteria.
                  </p>
                  <p className="mt-2 text-sm">
                    Try adjusting your search filters for more results.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBank;
