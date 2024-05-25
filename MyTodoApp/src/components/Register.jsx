import React from 'react'
import { useState,useEffect } from 'react';

function Register({user, setUser, password, setPassword, setReloaded, handleLogout}) {
    const [email, setEmail] = useState('');
    const register = async (username, password, email) => {
        try {
            handleLogout();
          const response = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email}),
            credentials: 'include', // Include cookies in the request
          });
    
          if (!response.ok) {
            throw new Error('register failed');
          }
          else{
            setReloaded((prev)=>prev+1);
          }
        } catch (error) {
          // Handle error
          console.error(error);
        }
      };
  return (
    <form 
        onSubmit={(e) => {
            e.preventDefault();
            register(user, password, email);
           
        }
      } className="mb-4">
      <input
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Username"
        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail"
        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
      >
        Register
      </button>
    </form>
  )
}

export default Register