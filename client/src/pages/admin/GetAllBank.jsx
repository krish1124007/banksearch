import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { BACKENDDOMAIN } from "../../const/backenddomain";


const GetAllBank = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBanks = async () => {
    try {
      const response = await axios.post(
        `${BACKENDDOMAIN}/api/v1/bank/getallbanks`
      );
      if (response.data.data.success) {
        setBanks(response.data.data.data);
      } else {
        toast.error("Failed to fetch banks.");
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      toast.error("Error fetching banks.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBank = async (bankId) => {
    const password = window.prompt("Enter password to delete this bank:");
    if (password === null) return; // User cancelled

    if (password !== "Prince2211") {
      toast.error("Incorrect password. You are not allowed to delete this bank.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this bank?")) {
      try {
        const response = await axios.post(
          `${BACKENDDOMAIN}/api/v1/bank/deletebank`,
          { bankId }
        );
        if (response.data.data.success) {
          toast.success("Bank deleted successfully.");
          fetchBanks();
        } else {
          toast.error("Failed to delete the bank.");
        }
      } catch (error) {
        console.error("Error deleting bank:", error);
        toast.error("Error deleting bank.");
      }
    }
  };

  const deleteAllBanks = async () => {
    const password = window.prompt("Enter password to delete ALL banks:");
    if (password === null) return; // User cancelled

    if (password !== "Prince2211") {
      toast.error("Incorrect password. You are not allowed to delete all banks.");
      return;
    }

    if (window.confirm("Are you sure you want to delete ALL banks? This action cannot be undone.")) {
      try {
        const response = await axios.post(
          `${BACKENDDOMAIN}/api/v1/bank/deleteallbanks`
        );
        if (response.data.data?.success) {
          toast.success("All banks deleted successfully.");
          fetchBanks();
        } else {
          toast.error("Failed to delete all banks.");
        }
      } catch (error) {
        console.error("Error deleting all banks:", error);
        toast.error("Error deleting all banks.");
      }
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-4 sm:py-8 px-2 sm:px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4 border-b border-blue-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Registered Bank Directory
              </h2>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/dashboard')}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm whitespace-nowrap"
                >
                  Back to Dashboard
                </motion.button>
                {banks.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={deleteAllBanks}
                    className="bg-white text-red-600 hover:bg-red-50 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm whitespace-nowrap"
                  >
                    Delete All
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                ></motion.div>
              </div>
            ) : banks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <svg
                  className="mx-auto h-12 w-12 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-slate-800">
                  No banks found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  There are currently no banks registered in the system.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/add-bank')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Add New Bank
                </motion.button>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow-sm border border-slate-200 rounded-lg">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-slate-700 uppercase tracking-wider"
                          >
                            Bank Name
                          </th>
                          <th
                            scope="col"
                            className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-slate-700 uppercase tracking-wider"
                          >
                            Contact
                          </th>
                          <th
                            scope="col"
                            className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-slate-700 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        <AnimatePresence>
                          {banks.map((bank, idx) => (
                            <motion.tr
                              key={bank._id || idx}
                              variants={rowVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              layout
                              className="hover:bg-blue-50 transition-colors duration-150"
                            >
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  className="text-sm font-medium text-blue-600 cursor-pointer"
                                  onClick={() =>
                                    navigate(`/bank/${bank._id}`, { state: { bank } })
                                  }
                                >
                                  {bank.bank_details.bank_name}
                                </motion.div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-700">
                                  {bank.bank_details.bank_sm_contact_number}
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end items-center gap-3">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      navigate(`/update-bank/${bank._id}`, {
                                        state: { bank },
                                      })
                                    }
                                    className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                  >
                                    Edit
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => deleteBank(bank._id)}
                                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-100 transition-colors"
                                  >
                                    Delete
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      navigate(`/bank/${bank._id}`, { state: { bank } })
                                    }
                                    className="text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
                                  >
                                    View
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GetAllBank;