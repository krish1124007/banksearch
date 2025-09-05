import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { BACKENDDOMAIN } from "../../const/backenddomain";


const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BACKENDDOMAIN}/api/v1/user/get/${id}`);
      if (res.data.status === 200 && res.data.data.success) {
        console.log(res.data.data.data)
        setUser(res.data.data.data);
      } else {
        toast.error("User not found");
        navigate("/get-users");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></motion.div>
      </div>
    );
  }

  if (!user) return null;

  const DetailCard = ({ title, value, className = "" }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-b border-blue-100 pb-4 ${className}`}
    >
      <h3 className="text-sm font-medium text-blue-700">{title}</h3>
      <p className="mt-1 text-lg font-semibold text-blue-900">{value}</p>
    </motion.div>
  );

  // Helper function to render only true fields
  const renderTrueFields = (obj, prefix = "") => {
    if (!obj) return null;
    
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return renderTrueFields(value, `${prefix}${key}.`);
      }
      
      if (value === true || (typeof value === 'number' && value > 0 && !key.startsWith('_'))) {
        return (
          <div key={`${prefix}${key}`} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
          </div>
        );
      }
      return null;
    });
  };

  // Helper function to render charges only if they're > 0
  const renderCharges = (charges) => {
    if (!charges) return null;
    
    return Object.entries(charges).map(([key, value]) => {
      if (typeof value === 'number' && value > 0 && !key.startsWith('_')) {
        return (
          <div key={key} className="flex justify-between">
            <span className="text-sm capitalize">{key.replace(/_/g, ' ')}:</span>
            <span className="text-sm font-medium">₹{value}</span>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-200"
        >
          <div className="bg-blue-600 px-6 py-4 border-b border-blue-300">
            <h1 className="text-2xl font-bold text-white">User Details</h1>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <DetailCard title="Name" value={user.name} />
              <DetailCard title="Contact Number" value={user.contact_number} />
              
              <div>
                <h3 className="text-sm font-medium text-blue-700 mb-2">Search Objects</h3>
                <AnimatePresence>
                  {user.search_objects?.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 bg-blue-50 rounded-lg p-4"
                    >
                      <ul className="space-y-4">
                        {user.search_objects.map((item, idx) => {
                          let parsed;
                          try {
                            parsed = typeof item === "string" ? JSON.parse(item) : item;
                          } catch (err) {
                            return (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="text-sm text-red-600 bg-white p-4 rounded border border-blue-100"
                              >
                                Error parsing search object
                              </motion.li>
                            );
                          }

                          return (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              whileHover={{ scale: 1.02 }}
                              className="text-sm text-blue-800 bg-white p-4 rounded-lg shadow-sm border border-blue-100 cursor-pointer hover:bg-blue-50 transition-all"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium">Bank Name:</p>
                                  <p className="text-blue-900">{parsed.bank_details?.bank_name || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Contact:</p>
                                  <p>{parsed.bank_details?.bank_contact_number || "N/A"}</p>
                                </div>
                                
                                {/* Loan Types Section - Only show if true */}
                                {(parsed.home_loan?.home_loan || 
                                  parsed.mortgage_loan?.mortgage_loan || 
                                  parsed.commercial_loan?.commercial_loan || 
                                  parsed.industrial_loan?.industrial_loan) && (
                                  <div className="md:col-span-2">
                                    <p className="font-medium">Active Loan Types:</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {parsed.home_loan?.home_loan && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                          Home Loan
                                        </span>
                                      )}
                                      {parsed.mortgage_loan?.mortgage_loan && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                          Mortgage
                                        </span>
                                      )}
                                      {parsed.commercial_loan?.commercial_loan && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                          Commercial
                                        </span>
                                      )}
                                      {parsed.industrial_loan?.industrial_loan && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                          Industrial
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                {/* True Fields Section */}
                                <div className="md:col-span-2">
                                  <p className="font-medium">Enabled Features:</p>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                    {renderTrueFields(parsed.home_loan)}
                                    {renderTrueFields(parsed.mortgage_loan)}
                                    {renderTrueFields(parsed.commercial_loan)}
                                    {renderTrueFields(parsed.industrial_loan)}
                                    {renderTrueFields(parsed.insurance)}
                                  </div>
                                </div>
                                
                                {/* Charges Section - Only show if > 0 */}
                                {(parsed.login_fees || parsed.legal_charges || parsed.processing_fees || 
                                  parsed.valuation_charges || parsed.extra_work || parsed.parallel_funding) && (
                                  <div className="md:col-span-2">
                                    <p className="font-medium">Charges:</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 bg-blue-50 p-3 rounded">
                                      {renderCharges(parsed.login_fees)}
                                      {parsed.legal_charges > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-sm">Legal Charges:</span>
                                          <span className="text-sm font-medium">₹{parsed.legal_charges}</span>
                                        </div>
                                      )}
                                      {parsed.processing_fees > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-sm">Processing Fees:</span>
                                          <span className="text-sm font-medium">₹{parsed.processing_fees}</span>
                                        </div>
                                      )}
                                      {parsed.valuation_charges > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-sm">Valuation Charges:</span>
                                          <span className="text-sm font-medium">₹{parsed.valuation_charges}</span>
                                        </div>
                                      )}
                                      {parsed.extra_work > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-sm">Extra Work:</span>
                                          <span className="text-sm font-medium">₹{parsed.extra_work}</span>
                                        </div>
                                      )}
                                      {parsed.parallel_funding > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-sm">Parallel Funding:</span>
                                          <span className="text-sm font-medium">₹{parsed.parallel_funding}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Tenor Section */}
                                {(parsed.tenor_salaried || parsed.tenor_self_employed) && (
                                  <div>
                                    <p className="font-medium">Tenor:</p>
                                    {parsed.tenor_salaried && (
                                      <>
                                        <p className="text-sm">
                                          Salaried: {parsed.tenor_salaried.from || "N/A"} - {parsed.tenor_salaried.to || "N/A"} yrs
                                        </p>
                                      </>
                                    )}
                                    {parsed.tenor_self_employed && (
                                      <p className="text-sm">
                                        Self-Employed: {parsed.tenor_self_employed.from || "N/A"} - {parsed.tenor_self_employed.to || "N/A"} yrs
                                      </p>
                                    )}
                                  </div>
                                )}
                                
                                {/* Policy USP */}
                                {parsed.policy?.usp_description && (
                                  <div className="md:col-span-2">
                                    <p className="font-medium">USP:</p>
                                    <p className="italic text-blue-700">{parsed.policy.usp_description}</p>
                                  </div>
                                )}
                              </div>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-sm text-blue-600 italic"
                    >
                      No search data found
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.div 
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
              >
                Back to Users
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserDetail;