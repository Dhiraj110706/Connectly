// import React, { useState } from 'react'
// import { Link, Navigate } from 'react-router-dom'
// import { useAuth } from '../../contexts/AuthContext'

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     password2: '',
//     avatar: '👤'
//   })
//   const [errors, setErrors] = useState({})
//   const [loading, setLoading] = useState(false)
//   const { register, user } = useAuth()

//   if (user) {
//     return <Navigate to="/" />
//   }

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setErrors({})

//     const result = await register(formData)
    
//     if (!result.success) {
//       setErrors(result.error)
//     }
    
//     setLoading(false)
//   }

//   const avatarOptions = ['👤', '👨‍💻', '👩‍🎨', '👨‍🚀', '👩‍🔬', '🧑‍🎓', '👨‍🎤', '👩‍💼']

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 px-4">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Join SocialConnect</h1>
//           <p className="text-gray-600 mt-2">Create your account</p>
//         </div>

//         {errors.non_field_errors && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {errors.non_field_errors}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Username
//             </label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               className="input-field"
//               required
//             />
//             {errors.username && (
//               <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="input-field"
//               required
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Avatar
//             </label>
//             <div className="flex gap-2 flex-wrap">
//               {avatarOptions.map((avatar) => (
//                 <button
//                   key={avatar}
//                   type="button"
//                   onClick={() => setFormData({...formData, avatar})}
//                   className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
//                     formData.avatar === avatar 
//                       ? 'border-blue-500 bg-blue-50' 
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   {avatar}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="input-field"
//               required
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               name="password2"
//               value={formData.password2}
//               onChange={handleChange}
//               className="input-field"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full btn-primary disabled:opacity-50"
//           >
//             {loading ? 'Creating Account...' : 'Create Account'}
//           </button>
//         </form>

//         <p className="text-center mt-6 text-gray-600">
//           Already have an account?{' '}
//           <Link to="/login" className="text-blue-600 hover:underline font-medium">
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }

// export default Register

// import React, { useState } from 'react'
// import { Link, Navigate } from 'react-router-dom'
// import { useAuth } from '../../contexts/AuthContext'

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     password2: '',
//     avatar: '👤'
//   })
//   const [errors, setErrors] = useState({})
//   const [loading, setLoading] = useState(false)
//   const { register, user } = useAuth()

//   if (user) {
//     return <Navigate to="/" />
//   }

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setErrors({})

//     const result = await register(formData)
    
//     if (!result.success) {
//       setErrors(result.error)
//     }
    
//     setLoading(false)
//   }

//   const avatarOptions = ['👤', '👨‍💻', '👩‍🎨', '👨‍🚀', '👩‍🔬', '🧑‍🎓', '👨‍🎤', '👩‍💼']

//   return (
//     <div className="min-h-screen flex bg-white">
//       {/* Left side - Image/Decoration */}
//       <div className="hidden lg:block relative w-0 flex-1">
//         <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
//         <div className="h-full w-full bg-gray-900 opacity-20"></div>
//         <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center w-3/4">
//           <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
//             <h3 className="text-3xl font-bold text-dark mb-4">Join Our Community</h3>
//             <p className="text-gray-900 text-lg">Create an account to access exclusive features and connect with others.</p>
//           </div>
//         </div>
//         <div className="absolute bottom-10 left-0 right-0 text-center">
//           <p className="text-sm text-indigo-200">© 2025 Connectly. All rights reserved.</p>
//         </div>
//       </div>

//       {/* Right side - Form */}
//       <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
//         <div className="mx-auto w-full max-w-sm lg:w-96">
//           <div>
//             <div className="flex items-center">
//               <div className="bg-indigo-600 rounded-lg w-10 h-10 flex items-center justify-center shadow-md">
//                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
//                 </svg>
//               </div>
//               <span className="ml-3 text-2xl font-bold text-gray-900">YourBrand</span>
//             </div>
//             <h2 className="mt-8 text-3xl font-extrabold text-gray-900">Create your account</h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Already have an account?{' '}
//               <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
//                 Sign in here
//               </Link>
//             </p>
//           </div>

//           <div className="mt-8">
//             {errors.non_field_errors && (
//               <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-sm">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-red-700">{errors.non_field_errors}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//                   Username
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     autoComplete="username"
//                     required
//                     value={formData.username}
//                     onChange={handleChange}
//                     className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
//                     placeholder="Enter your username"
//                   />
//                 </div>
//                 {errors.username && (
//                   <p className="mt-1 text-sm text-red-600">{errors.username[0]}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email address
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     autoComplete="email"
//                     required
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
//                     placeholder="you@example.com"
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Choose an Avatar
//                 </label>
//                 <div className="flex gap-3 flex-wrap mt-1">
//                   {avatarOptions.map((avatar) => (
//                     <button
//                       key={avatar}
//                       type="button"
//                       onClick={() => setFormData({...formData, avatar})}
//                       className={`text-2xl p-2 rounded-lg border-2 transition-all duration-200 ${
//                         formData.avatar === avatar 
//                           ? 'border-indigo-500 bg-indigo-100 scale-110' 
//                           : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                       }`}
//                     >
//                       {avatar}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     autoComplete="new-password"
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
//                     placeholder="••••••••"
//                   />
//                 </div>
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
//                   Confirm Password
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="password2"
//                     name="password2"
//                     type="password"
//                     autoComplete="new-password"
//                     required
//                     value={formData.password2}
//                     onChange={handleChange}
//                     className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
//                     placeholder="••••••••"
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center">
//                 <input
//                   id="terms"
//                   name="terms"
//                   type="checkbox"
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   required
//                 />
//                 <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
//                   I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
//                 </label>
//               </div>

//               <div>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
//                 >
//                   {loading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Creating Account...
//                     </>
//                   ) : 'Create Account'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Register

import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: -100,
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    avatar: '👤'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const location = useLocation();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await register(formData);
    
    if (!result.success) {
      setErrors(result.error);
    }
    
    setLoading(false);
  };

  const avatarOptions = ['👤', '👨‍💻', '👩‍🎨', '👨‍🚀', '👩‍🔬', '🧑‍🎓', '👨‍🎤', '👩‍💼'];

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen flex bg-white"
    >
      {/* Left side - Image/Decoration */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
        <div className="h-full w-full bg-gray-900 opacity-20"></div>
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center w-3/4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-2xl p-8 shadow-2xl"
          >
            <h3 className="text-3xl font-bold text-dark mb-4">Join Our Community</h3>
            <p className="text-gray-900 text-lg">Create an account to access exclusive features and connect with others.</p>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <p className="text-sm text-indigo-200">© 2025 Connectly. All rights reserved.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="bg-indigo-600 rounded-lg w-10 h-10 flex items-center justify-center shadow-md"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </motion.div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="ml-3 text-2xl font-bold text-gray-900"
              >
                Connectly
              </motion.span>
            </div>
            <motion.h2 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-3xl font-extrabold text-gray-900"
            >
              Create your account
            </motion.h2>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-sm text-gray-600"
            >
              Already have an account?{' '}
              <Link 
                to="/login" 
                state={{ from: location }}
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </motion.p>
          </div>

          <div className="mt-8">
            {errors.non_field_errors && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-sm"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.non_field_errors}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                    placeholder="Enter your username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username[0]}</p>
                )}
              </motion.div>

              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                )}
              </motion.div>

              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose an Avatar
                </label>
                <div className="flex gap-3 flex-wrap mt-1">
                  {avatarOptions.map((avatar, index) => (
                    <motion.button
                      key={avatar}
                      type="button"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9 + (index * 0.05) }}
                      onClick={() => setFormData({...formData, avatar})}
                      className={`text-2xl p-2 rounded-lg border-2 transition-all duration-200 ${
                        formData.avatar === avatar 
                          ? 'border-indigo-500 bg-indigo-100 scale-110' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {avatar}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                )}
              </motion.div>

              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="password2"
                    name="password2"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password2}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center"
              >
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                </label>
              </motion.div>

              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : 'Create Account'}
                </button>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;