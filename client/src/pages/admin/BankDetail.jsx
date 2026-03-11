import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { BACKENDDOMAIN } from "../../const/backenddomain";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BankDetail = () => {
  const { state } = useLocation();
  const bank = state?.bank;
  const navigate = useNavigate();

  if (!bank)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-10 text-xl font-semibold text-red-600"
      >
        No Bank Data Provided. Please go back and select a bank.
      </motion.div>
    );

  // Fix for login_fees rendering
  const loginFees = typeof bank.login_fees === 'object' ? bank.login_fees : {
    login_salaried: 0,
    login_self_employed: 0
  };

  // Prepare data for charts
  const interestRateData = {
    labels: ['Salaried', 'Non-Salaried'],
    datasets: [
      {
        label: 'Min Rate (%)',
        data: [
          bank.home_loan?.interest_rate?.salaried?.from || 0,
          bank.home_loan?.interest_rate?.non_salaried?.from || 0
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Max Rate (%)',
        data: [
          bank.home_loan?.interest_rate?.salaried?.to || 0,
          bank.home_loan?.interest_rate?.non_salaried?.to || 0
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  const tenureData = {
    labels: ['Salaried', 'Self Employed'],
    datasets: [
      {
        label: 'Min Tenure (years)',
        data: [
          bank.tenor_salaried?.from || 0,
          bank.tenor_self_employed?.from || 0
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Max Tenure (years)',
        data: [
          bank.tenor_salaried?.to || 0,
          bank.tenor_self_employed?.to || 0
        ],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      }
    ]
  };

  const renderInterestRates = (rates) => (
    <div className="ml-6 mt-2">
      <Bar
        data={interestRateData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Interest Rate Comparison',
            },
          },
        }}
        height={200}
      />
      <div className="mt-4 text-base text-gray-700 space-y-1">
        <p>
          <span className="font-medium">Salaried:</span> {rates.salaried?.from}% -{" "}
          {rates.salaried?.to}% {rates.salaried?.foir && `(FOIR: ${rates.salaried.foir}%)`}
        </p>
        <p>
          <span className="font-medium">Non-Salaried:</span>{" "}
          {rates.non_salaried?.from}% - {rates.non_salaried?.to}% {rates.non_salaried?.foir && `(FOIR: ${rates.non_salaried.foir}%)`}
        </p>
      </div>
    </div>
  );

  const renderLoanDetails = (loanTypeData) => {
    if (!loanTypeData) return null;

    return (
      <div className="ml-6 mt-4 space-y-3">
       {loanTypeData.LTV && (
  <motion.div
    className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
    whileHover={{ scale: 1.02 }}
  >
    <p className="font-medium text-gray-800 mb-2">LTV Details</p>

    <div className="overflow-x-auto">
      <p>{loanTypeData.LTV}</p>
    </div>
  </motion.div>
)}

        {loanTypeData.loan_ticket_size && (
          <motion.div
            className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <p className="font-medium text-gray-800">Loan Ticket Size</p>
            <p className="text-lg font-semibold text-blue-600">
              ₹{loanTypeData.loan_ticket_size.from.toLocaleString()} - ₹{loanTypeData.loan_ticket_size.to.toLocaleString()}
            </p>
          </motion.div>
        )}
        {(loanTypeData.layout_plan > 0 || loanTypeData.unit_plan > 0) && (
          <div className="flex gap-4">
            {loanTypeData.layout_plan > 0 && (
              <motion.div
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex-1"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium text-gray-800">Layout Plan</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {loanTypeData.layout_plan} <span className="text-sm">years</span>
                </p>
              </motion.div>
            )}
            {loanTypeData.unit_plan > 0 && (
              <motion.div
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex-1"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium text-gray-800">Unit Plan</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {loanTypeData.unit_plan} <span className="text-sm">years</span>
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderBooleansAsList = (data) => {
    const filteredItems = Object.entries(data).filter(
      ([key, value]) => typeof value === "boolean" && value === true && key !== "_id" && key !== "__v"
    );

    if (filteredItems.length === 0) {
      return <p className="text-gray-500 italic ml-6">No specific features listed.</p>;
    }

    return (
      <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
        {filteredItems.map(([key]) => (
          <motion.li
            key={key}
            className="capitalize"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {key.replaceAll("_", " ")}
          </motion.li>
        ))}
      </ul>
    );
  };

  const renderInsurance = (insurance) => {
    const insuranceTypes = Object.entries(insurance).filter(
      ([key]) => key !== "_id" && key !== "__v"
    );

    if (insuranceTypes.length === 0) {
      return <p className="text-gray-500 italic">No insurance details available.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insuranceTypes.map(([type, details]) => {
          const validDetails = Object.entries(details).filter(([, val]) => val);
          if (validDetails.length === 0) return null;

          return (
            <motion.div
              key={type}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              whileHover={{ y: -3 }}
            >
              <h3 className="font-semibold text-lg text-gray-800 capitalize mb-2">
                {type.replace("_", " ")}
              </h3>
              <ul className="space-y-1">
                {validDetails.map(([k]) => (
                  <li key={k} className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="capitalize">{k.replaceAll("_", " ")}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const SectionTitle = ({ icon, title }) => (
    <motion.h2
      className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2 border-gray-200"
      whileHover={{ x: 5 }}
    >
      <span className="text-blue-600">{icon}</span> {title}
    </motion.h2>
  );

  const SectionCard = ({ children, className = "" }) => (
    <motion.section
      className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md border border-gray-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
    >
      {children}
    </motion.section>
  );

  const StatCard = ({ title, value, unit = "", color = "blue" }) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      indigo: "bg-indigo-100 text-indigo-800",
      purple: "bg-purple-100 text-purple-800"
    };

    return (
      <motion.div
        className={`${colors[color]} p-4 rounded-lg`}
        whileHover={{ scale: 1.03 }}
      >
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">
          {value} {unit && <span className="text-sm">{unit}</span>}
        </p>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto my-8 p-4 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100"
    >
      {/* PROFESSIONAL HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-10 px-6 rounded-2xl shadow-lg mb-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20"></div>
        <div className="relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            whileHover={{ scale: 1.02 }}
          >
            {bank.bank_name}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl font-light opacity-90 mb-6"
            whileHover={{ scale: 1.01 }}
          >
            {bank.bank_details.bank_name}
          </motion.p>
          <div className="flex justify-center gap-6">
            
            {bank.geo_limit > 0 && (
              <motion.p
                className="text-lg bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                🗺️ Coverage: {bank.geo_limit} km
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* QUICK STATS SECTION */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <StatCard
          title="Min Interest Rate"
          value={bank.home_loan?.interest_rate?.salaried?.from || "N/A"}
          unit="%"
          color="blue"
        />
        <StatCard
          title="Max Tenure"
          value={bank.tenor_salaried?.to || "N/A"}
          unit="years"
          color="green"
        />
        <StatCard
          title="Processing Fees"
          value={bank.processing_fees > 0 ? `₹${bank.processing_fees}` : "N/A"}
          color="indigo"
        />
        <StatCard
          title="Legal Charges"
          value={bank.legal_charges > 0 ? `₹${bank.legal_charges}` : "N/A"}
          color="purple"
        />
        <StatCard
          title="Bank SM"
          value={bank.bank_details.bank_sm_name || "N/A"}
          color="blue"
        />
        <StatCard
          title="Bank ASM"
          value={bank.bank_details.bank_rsm_name || "N/A"}
          color="green"
        />
        <StatCard
          title="SM Contact"
          value={bank.bank_details.bank_sm_contact_number || "N/A"}
          color="indigo"
        />
        <StatCard
          title="ASM Contact"
          value={bank.bank_details.bank_rsm_contact_number || "N/A"}
          color="purple" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* HOME LOAN */}
        <SectionCard>
          <SectionTitle icon="🏠" title="Home Loan" />
          {bank.home_loan?.home_loan ? (
            <>
              {renderBooleansAsList(bank.home_loan)}
              <h3 className="font-semibold text-lg mt-6 text-gray-800">
                Interest Rates:
              </h3>
              {renderInterestRates(bank.home_loan.interest_rate)}
              {renderLoanDetails(bank.home_loan)}
              {bank.home_loan.nir_home_loan?.visa_type && (
                <motion.div
                  className="mt-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="font-medium text-gray-800">NRI Home Loan</p>
                  <p className="text-blue-600">
                    Visa Type: {bank.home_loan.nir_home_loan.visa_type}
                  </p>
                  {bank.home_loan.nir_home_loan.salary_in_dollar && (
                    <p className="text-sm text-gray-600 mt-1">Salary in USD</p>
                  )}
                </motion.div>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic">Not available</p>
          )}
        </SectionCard>

        {/* MORTGAGE LOAN */}
        <SectionCard>
          <SectionTitle icon="🏢" title="Mortgage Loan" />
          {bank.mortgage_loan?.mortgage_loan ? (
            <>
              {renderBooleansAsList(bank.mortgage_loan)}
              <h3 className="font-semibold text-lg mt-6 text-gray-800">
                Interest Rates:
              </h3>
              {renderInterestRates(bank.mortgage_loan.interest_rate)}
              {renderLoanDetails(bank.mortgage_loan)}
              
              {bank.policy.self_employed.dod && (
                <motion.div
                  className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">💰</span>
                    <h4 className="font-bold text-amber-800">DOD Details</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    {bank.policy.self_employed.dod_details?.renewal_charges && (
                       <p className="flex justify-between border-b border-amber-100 pb-1">
                         <span className="text-gray-600">Renewal Charges:</span>
                         <span className="font-semibold text-amber-700">
                           {bank.policy.self_employed.dod_details.renewal_charges_type === 'amount' ? '₹' : ''}
                           {bank.policy.self_employed.dod_details.renewal_charges_value}
                           {bank.policy.self_employed.dod_details.renewal_charges_type === 'percentage' ? '%' : ''}
                         </span>
                       </p>
                    )}
                    <p className="flex justify-between border-b border-amber-100 pb-1">
                      <span className="text-gray-600">Utilization Ratio:</span>
                      <span className="font-semibold text-amber-700">{bank.policy.self_employed.dod_details?.utilization_ratio_quarterly}%</span>
                    </p>
                    <p className="flex justify-between border-b border-amber-100 pb-1">
                      <span className="text-gray-600">Turnover Ratio:</span>
                      <span className="font-semibold text-amber-700">{bank.policy.self_employed.dod_details?.turnover_ratio_applicable ? 'Applicable' : 'Not Applicable'}</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic">Not available</p>
          )}
        </SectionCard>

        {/* COMMERCIAL LOAN */}
        <SectionCard>
          <SectionTitle icon="🏬" title="Commercial Loan" />
          {bank.commercial_loan?.commercial_loan ? (
            <>
              {renderBooleansAsList(bank.commercial_loan)}
              <h3 className="font-semibold text-lg mt-6 text-gray-800">
                Interest Rates:
              </h3>
              {renderInterestRates(bank.commercial_loan.interest_rate)}
              {renderLoanDetails(bank.commercial_loan)}
            </>
          ) : (
            <p className="text-gray-500 italic">Not available</p>
          )}
        </SectionCard>

        {/* INDUSTRIAL LOAN */}
        <SectionCard>
          <SectionTitle icon="🏭" title="Industrial Loan" />
          {bank.industrial_loan?.industrial_loan ? (
            <>
              {renderBooleansAsList(bank.industrial_loan)}
              <h3 className="font-semibold text-lg mt-6 text-gray-800">
                Interest Rates:
              </h3>
              {renderInterestRates(bank.industrial_loan.interest_rate)}
              {renderLoanDetails(bank.industrial_loan)}
            </>
          ) : (
            <p className="text-gray-500 italic">Not available</p>
          )}
        </SectionCard>

        {/* INSURANCE */}
        <SectionCard>
          <SectionTitle icon="🛡️" title="Insurance" />
          {renderInsurance(bank.insurance)}
        </SectionCard>

        {/* TENURE */}
        <SectionCard>
          <SectionTitle icon="📆" title="Tenure" />
          <Bar
            data={tenureData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Loan Tenure Comparison',
                },
              },
            }}
            height={200}
          />
          <div className="mt-4 space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Salaried:</span>{" "}
              {bank.tenor_salaried?.from} - {bank.tenor_salaried?.to} years
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Self-Employed:</span>{" "}
              {bank.tenor_self_employed?.from} - {bank.tenor_self_employed?.to}{" "}
              years
            </p>
          </div>
        </SectionCard>

        {/* AGE LIMIT */}
        <SectionCard>
          <SectionTitle icon="🎂" title="Age Limits" />
          <div className="flex gap-4">
            <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Salaried</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {bank.age?.salaried.min_age} - {bank.age?.salaried.max_age}
                  </p>
                  {bank.age?.salaried.extension_age_period > 0 && (
                    <p className="text-sm text-gray-600">
                      Extension: +{bank.age.salaried.extension_age_period} years
                    </p>
                  )}
                </div>
                <div className="text-4xl">👨‍💼</div>
              </div>
            </div>
            <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Self-Employed</h3>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-indigo-600">
                  {bank.age?.self_employed.min_age} - {bank.age?.self_employed.max_age}
                </p>
                <div className="text-4xl">👨‍💻</div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* CIBIL */}
        <SectionCard>
          <SectionTitle icon="📊" title="CIBIL" />
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Minimum Score</p>
                <p className="text-3xl font-bold text-purple-600">
                  {bank.policy.cibil.min_score}
                </p>
              </div>
              <div className="w-24 h-24 rounded-full border-8 border-purple-200 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">
                  {Math.min(Math.floor(bank.policy.cibil.min_score / 8.5), 100)}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${bank.policy.cibil.call_accepted ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Call Accepted: {bank.policy.cibil.call_accepted ? "Yes" : "No"}</span>
              </p>
              <p className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${bank.policy.cibil.current_bounce_accepted ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Current Bounce Accepted: {bank.policy.cibil.current_bounce_accepted ? "Yes" : "No"}</span>
              </p>
              {bank.policy.cibil.accepted_type.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Accepted Types:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {bank.policy.cibil.accepted_type.map((type, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Charges */}
        <SectionCard>
          <SectionTitle icon="💰" title="Charges & Fees" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fixed login_fees rendering */}
            <motion.div
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-semibold text-gray-800 mb-2">Login Fees</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Salaried:</span> ₹
                  {loginFees.login_salaried || 0}
                </p>
                <p>
                  <span className="font-medium">Self-Employed:</span> ₹
                  {loginFees.login_self_employed || 0}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-semibold text-gray-800 mb-2">Other Fees</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Processing:</span>{" "}
                  {bank.processing_fees > 0 ? `₹${bank.processing_fees}` : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Legal:</span> ₹
                  {bank.legal_charges || 0}
                </p>
                <p>
                  <span className="font-medium">Valuation:</span> ₹
                  {bank.valuation_charges || 0}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 md:col-span-2"
              whileHover={{ scale: 1.01 }}
            >
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <span>➕</span> Additional Info & Funding
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Extra Work */}
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  <p className="font-bold text-blue-800 text-sm mb-2 uppercase tracking-tight">Extra Work</p>
                  <p className="text-2xl font-bold text-blue-700">{bank.extra_work > 0 ? `${bank.extra_work}%` : "No"}</p>
                  {bank.extra_work > 0 && (bank.extra_work_disbursement?.length > 0 || typeof bank.extra_work_disbursement === 'string') && (
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Disbursement To:</p>
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(bank.extra_work_disbursement) ? bank.extra_work_disbursement : [bank.extra_work_disbursement]).map(item => (
                          <span key={item} className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full capitalize">
                            {item?.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Parallel Funding */}
                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                  <p className="font-bold text-indigo-800 text-sm mb-2 uppercase tracking-tight">Parallel Funding</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${bank.parallel_funding?.enabled ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-400'}`}></div>
                    <span className="text-xl font-bold text-indigo-700">
                      {bank.parallel_funding?.enabled ? 'Enabled' : 'Not Allowed'}
                    </span>
                  </div>
                  {bank.parallel_funding?.enabled && (
                    <div className="mt-2 pt-2 border-t border-indigo-200">
                      <p className="text-[10px] text-indigo-600 font-bold uppercase mb-1">Max Funding Stage:</p>
                      <p className="text-lg font-bold text-indigo-600">{bank.parallel_funding.stage_percentage}% <span className="text-xs font-normal">of project</span></p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </SectionCard>

        {/* Self Employed Policy */}
        <SectionCard>
          <SectionTitle icon="👨‍💼" title="Self-Employed Policy" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(bank.policy.self_employed)
              .filter(([k, v]) => typeof v === "boolean" && k !== "_id" && k !== "__v")
              .map(([key, value]) => (
                <motion.div
                  key={key}
                  className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`w-4 h-4 rounded-full mr-3 ${value ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium capitalize">
                    {key.replaceAll("_", " ")}:
                  </span>
                  <span className="ml-1">{value ? "Yes" : "No"}</span>
                </motion.div>
              ))}
          </div>

          {/* Detailed Surrogate & Policy Info */}
          <div className="mt-6 space-y-4">
            {/* Banking Surrogate */}
            {bank.policy.self_employed.banking_surrogate && (
              <motion.div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm" whileHover={{ scale: 1.01 }}>
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <span>🏦</span> Banking Surrogate Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                  <p><span className="text-gray-600">Period:</span> <span className="font-semibold capitalize text-blue-700">{bank.policy.self_employed.banking_surrogate_details?.period?.replace('_', ' ')}</span></p>
                  <p><span className="text-gray-600">FOIR of ABB:</span> <span className="font-semibold text-blue-700">{bank.policy.self_employed.banking_surrogate_details?.foir_of_abb}%</span></p>
                  <p className="col-span-2"><span className="text-gray-600">Banking Dates:</span> <span className="font-semibold text-blue-700">{bank.policy.self_employed.banking_surrogate_details?.dates}</span></p>
                  <p><span className="text-gray-600">Max Club Account:</span> <span className="font-semibold text-blue-700">{bank.policy.self_employed.banking_surrogate_details?.max_club_account}</span></p>
                </div>
              </motion.div>
            )}

            {/* GST Surrogate */}
            {bank.policy.self_employed.gst_surrogate && (
              <motion.div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm" whileHover={{ scale: 1.01 }}>
                <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  <span>📄</span> GST Surrogate Details
                </h4>
                <p className="text-sm"><span className="text-gray-600">GST Surrogate Ratio:</span> <span className="font-semibold text-green-700 text-lg">{bank.policy.self_employed.gst_surrogate_ratio}%</span></p>
              </motion.div>
            )}

            {/* Other Surrogates and Ratios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bank.policy.self_employed.rtr_surrogate && (
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <p className="text-xs text-orange-800 font-bold uppercase mb-1">RTR Surrogate</p>
                  <p className="text-lg font-bold text-orange-700">{bank.policy.self_employed.rtr_surrogate_ratio}% <span className="text-xs font-normal">Ratio</span></p>
                </div>
              )}
              {bank.policy.self_employed.industry_margin_surrogate && (
                <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                  <p className="text-xs text-teal-800 font-bold uppercase mb-1">Industry Margin</p>
                  <p className="text-lg font-bold text-teal-700">{bank.policy.self_employed.industry_margin_surrogate_ratio}% <span className="text-xs font-normal">Ratio</span></p>
                </div>
              )}
              {bank.policy.self_employed.gross_profit_surrogate && (
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                  <p className="text-xs text-indigo-800 font-bold uppercase mb-1">Gross Profit</p>
                  <p className="text-lg font-bold text-indigo-700">{bank.policy.self_employed.gross_profit_surrogate_ratio}% <span className="text-xs font-normal">Ratio</span></p>
                </div>
              )}
              {bank.policy.self_employed.low_ltv && (
                <div className="bg-sky-50 p-3 rounded-lg border border-sky-200">
                  <p className="text-xs text-sky-800 font-bold uppercase mb-1">Low LTV Prog.</p>
                  <p className="text-sm font-bold text-sky-700">Ratio: {bank.policy.self_employed.low_ltv_ratio}%</p>
                  <p className="text-sm font-bold text-sky-700">Max: ₹{bank.policy.self_employed.low_ltv_max_amount?.toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* LIP Details */}
            {bank.policy.self_employed.lip && (
              <motion.div className="bg-purple-50 p-4 rounded-xl border border-purple-200 shadow-sm" whileHover={{ scale: 1.01 }}>
                <h4 className="font-bold text-purple-800 mb-2">LIP (Loan Insurance Policy) Details</h4>
                <div className="flex gap-6 text-sm">
                   <p><span className="text-gray-600">Max Multiple:</span> <span className="font-semibold text-purple-700 text-lg">{bank.policy.self_employed.lip_details?.max_multiple}x</span></p>
                   <p><span className="text-gray-600">LIP FOIR:</span> <span className="font-semibold text-purple-700 text-lg">{bank.policy.self_employed.lip_details?.foir}%</span></p>
                </div>
              </motion.div>
            )}

            {/* SE FOIR Slabs */}
            {bank.policy.self_employed.foir && bank.policy.self_employed.se_foir_slabs?.length > 0 && (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm">
                <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <span>📊</span> Self-Employed FOIR Slabs
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {bank.policy.self_employed.se_foir_slabs.map((slab, i) => (
                    <div key={i} className="bg-white p-2 rounded border border-amber-100 text-xs">
                      <p className="font-bold text-amber-700 border-b border-amber-50 mb-1">Income: {slab.income_range}K</p>
                      <div className="flex justify-between">
                        <span>Gross: <b>{slab.foir_gross}%</b></span>
                        <span>Net: <b>{slab.foir_net}%</b></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-2 gap-4 text-sm">
                <p><span className="text-gray-600">ITR Required:</span> <span className="font-semibold capitalize text-indigo-700">{bank.policy.self_employed.itr_required?.replace('_', ' ')}</span></p>
                <p><span className="text-gray-600">BCP Age:</span> <span className="font-semibold text-indigo-700">{bank.policy.self_employed.bcp_years} years</span></p>
            </div>
          </div>
          {(bank.policy.self_employed.not_selected_text_1 || bank.policy.self_employed.not_selected_text_2) && (
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  {bank.policy.self_employed.not_selected_text_1 && (
                    <p className="text-sm text-yellow-700">
                      {bank.policy.self_employed.not_selected_text_1}
                    </p>
                  )}
                  {bank.policy.self_employed.not_selected_text_2 && (
                    <p className="text-sm text-yellow-700 mt-1">
                      {bank.policy.self_employed.not_selected_text_2}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* POLICY SECTION */}
      <SectionCard className="mt-8">
        <SectionTitle icon="📜" title="Salaried Policy Details" />

        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-xl text-gray-800 mb-4">
              FOIR Slabs:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bank.policy.salaried.foir_slabs.length > 0 ? (
                bank.policy.salaried.foir_slabs.map((item, i) => (
                  <motion.div
                    key={i}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Income:</span>
                      <span className="font-semibold">{item.income_range}K</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">FOIR Gross:</span>
                      <span className="text-blue-600 font-semibold">{item.foir_gross}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">FOIR Net:</span>
                      <span className="text-indigo-600 font-semibold">{item.foir_net}%</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="italic text-gray-500">No FOIR slabs defined.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-semibold text-gray-800 mb-3">Cash Salary</h4>
              <div className={`w-full h-3 rounded-full ${bank.policy.salaried.cash_salary_accepted ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-center mt-2 font-medium">
                {bank.policy.salaried.cash_salary_accepted ? "Accepted" : "Not Accepted"}
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-semibold text-gray-800 mb-3">Additional Income</h4>
              {renderBooleansAsList(bank.policy.salaried.additional_income)}
            </motion.div>

            <motion.div
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-semibold text-gray-800 mb-3">Company Type</h4>
              {renderBooleansAsList(bank.policy.salaried.company_type)}
            </motion.div>
          </div>

          <motion.div
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="font-semibold text-gray-800 mb-3">Deductions</h4>
            {renderBooleansAsList(bank.policy.salaried.deduction)}
          </motion.div>
        </div>
      </SectionCard>

      {/* USP SECTION */}
      {bank.policy.usp_description && (
        <SectionCard className="mt-8">
          <SectionTitle icon="🌟" title="Unique Selling Points" />
          <motion.div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-700 italic text-lg">
              "{bank.policy.usp_description}"
            </p>
          </motion.div>
        </SectionCard>
      )}

      <div className="flex justify-center mt-10 gap-4">
        <motion.button
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center gap-2"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Go Back
        </motion.button>
        <motion.button
          className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300 ease-in-out flex items-center gap-2 border border-blue-200"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Go to Home
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BankDetail;