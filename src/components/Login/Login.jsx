import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('invalid email').required('Email required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters long.').required('Password required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const response = await loginUser(values.email, values.password);
        if (response) {
          setUserData(response);
          localStorage.setItem('uid',response.user.uid)
          dispatch(login(response.user.uid));
          navigate("/")
    
          


        } else {
          setError('User not found in Firestore!');
        }
      } catch (err) {
        setError(`invalid login ${err.message}`);
      }
      setLoading(false);
    },
  });

  return (
    <div className="login-form-container max-w-sm mx-auto mt-10 p-4 border border-gray-300 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

      <form onSubmit={formik.handleSubmit} className="login-form space-y-4">
        <input
          type="email"
          name="email"
          placeholder="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm">{formik.errors.email}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm">{formik.errors.password}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Logging in' : 'Login'}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

    </div>
  );
}
