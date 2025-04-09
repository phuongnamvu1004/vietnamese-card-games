// import React, { useState } from 'react';
// import axios from 'axios';
//
// const SignUp = () => {
//   // Form state
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });
//
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//
//   // Handle input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const {name, value} = e.target;
//     setFormData({...formData, [name]: value});
//   };
//
//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');
//
//     try {
//       const response = await axios.post('/api/auth/signup', formData); // Adjust the endpoint as per your API routing
//       setMessage('Signup successful! Please log in.');
//       setFormData({fullName: '', email: '', password: ''}); // Clear form after success
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Something went wrong. Please try again.');
//     }
//   };
//
//   return (
//     <div className="signup-container">
//       <h1>Sign Up</h1>
//       {error && <p className="error">{error}</p>}
//       {message && <p className="message">{message}</p>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="fullName">Full Name</label>
//           <input
//             type="text"
//             id="fullName"
//             name="fullName"
//             value={formData.fullName}
//             onChange={handleChange}
//             placeholder="Enter your full name"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password</label>
//           <div className="password-field">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               required
//               minLength={6}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="toggle-password"
//             >
//               {showPassword ? 'Hide' : 'Show'}
//             </button>
//           </div>
//         </div>
//         <button type="submit" className="submit-button">
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };
//
// export default SignUp;