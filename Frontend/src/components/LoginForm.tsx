import React, { useState } from 'react';
import { loginUser, registerUser } from '../utils/api'; // Import the new functions

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // This is essential to prevent the page from reloading
    setError('');

    try {
      if (isRegistering) {
        // Calls the register endpoint
        const data = await registerUser(email, password);
        console.log('Registration successful:', data.message);
      } else {
        // Calls the login endpoint
        const data = await loginUser(email, password);
        console.log('Login successful:', data.message);
        localStorage.setItem('token', data.token);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... your form fields for email and password ... */}
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        required 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        required 
      />
      <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
        Switch to {isRegistering ? 'Login' : 'Register'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default LoginForm;