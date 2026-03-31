import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/admin/AuthContext";
import { motion } from "framer-motion";
import { BACKENDDOMAIN } from "../../const/backenddomain";


const Dashboard = () => {
  const { logout } = useAuth();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const dashboardItems = [
    {
      title: "Add New Bank",
      path: "/add-bank",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      )
    },
    {
      title: "Search Banks",
      path: "/search-bank",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      )
    },
    {
      title: "View All Banks",
      path: "/get-all-bank",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
        />
      )
    },
    {
      title: "View All Users",
      path: "/get-users",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      )
    },
    {
      title: "Case Studies",
      path: "/case-study",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="border-b border-slate-200"
        >
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-slate-800">
              Admin Dashboard
            </h1>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="py-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-slate-100"
          >
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-blue-600">
              <h2 className="text-lg font-medium text-white">
                Bank Management
              </h2>
            </div>

            <div className="p-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {dashboardItems.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover={{ y: -5 }}
                  >
                    <Link
                      to={item.path}
                      className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 shadow-sm"
                    >
                      <svg
                        className="h-10 w-10 text-indigo-600 mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {item.icon}
                      </svg>
                      <span className="text-sm font-medium text-slate-700">
                        {item.title}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;