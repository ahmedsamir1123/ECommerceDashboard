import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUser } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
            fullName: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters long.")
                .required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm password is required"),
            fullName: Yup.string().required("Full name is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setError("");

            try {
                const user = await registerUser(values.email, values.password, {
                    fullName: values.fullName,
                });

                if (user) {
                    navigate("/login");
                }
            } catch (err) {
                setError(`Registration failed: ${err.message}`);
            }
            setLoading(false);
        },
    });

    return (
        <div className="register-form-container max-w-sm mx-auto mt-10 p-4 border border-gray-300 rounded-lg bg-white shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

            <form onSubmit={formik.handleSubmit} className="register-form space-y-4">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
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
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
                {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm">{formik.errors.password}</p>
                )}

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{formik.errors.confirmPassword}</p>
                )}

                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
                {formik.touched.fullName && formik.errors.fullName && (
                    <p className="text-red-500 text-sm">{formik.errors.fullName}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>
    );
}
