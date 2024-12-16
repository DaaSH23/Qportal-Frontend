import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../utils/context";
import BasicAlerts from "../components/AlertBar.js";

export default function Login() {
    const { dispatch } = useGlobalContext();
    const navigate = useNavigate();

    const [credential, setCredential] = useState({
        email: "",
        password: ""
    });

    const [alerts, setAlerts] = useState({
        show: false,
        status: "",
        msg: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setCredential({ ...credential, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    // Helper function for Alerts
    const handleAlerts = (status, msg)=>{
        setAlerts({
            show: true,
            status,
            msg,
        });

        setTimeout(()=>{
            setAlerts({
                show: false,
                status: "",
                msg: "",
            });
        }, 5000);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        // Validation check
        const errors = validate(credential);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            try {

                setIsLoading(true);
                const response = await fetch('http://localhost:5000/api/users/getUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credential),
                    credentials: 'include',
                });

                const responseData = await response.json();
                console.log("Response: ", response);
                console.log("ResponseData", responseData);

                if (!response.ok) {
                    handleAlerts("error", responseData.message || "Login failed. Please try again later");
                    // console.log("called");
                } else {
                    handleAlerts("success", responseData.message || "Loggin successful !");

                    dispatch({
                        type: "SET_STATE",
                        payload: {
                            isLoggedIn: true,
                            _id: responseData.data.userId,
                            role: responseData.data.userRole,
                            name: responseData.data.userName,
                        }
                    });

                    setTimeout(() => {
                        navigate("/home/QuestionPaperDashboard");
                    }, 1000);
                }
            } catch (err) {
                handleAlerts("error", "An error occurred. Please try again later.");
                console.error("Something went wrong!!, Error: ", err);
            } finally {
                setIsLoading(false);
            }
        };
    };

    const validate = (values) => {
        const error = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.email) {
            error.email = "Please enter email address.";
        } else if (!emailRegex.test(values.email)) {
            error.email = "Invalid email Address.";
        }

        if (!values.password) {
            error.password = "Please enter Password.";
        }
        return error;
    }

    return (
        <div className="flex-1 min-h-full flex flex-col justify-center py-14 lg:px-8 mt-16 relative">
            {/* Alert */}
            {alerts.show && (
                <div className="absolute inset-0 flex justify-center z-10">
                    <BasicAlerts
                        show={alerts.show}
                        status={alerts.status}
                        msg={alerts.msg}
                    />
                </div>
            )}

            {/* Form Section */}
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="flex justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-14 h-14"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </div>
                <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>
            <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleOnSubmit}>
                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Email Address
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={credential.email}
                                onChange={handleChange}
                            />
                        </div>
                        {formErrors.email && (
                            <p className="text-red-500 text-sm">{formErrors.email}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Password
                            </label>
                            <div className="text-sm">
                                <a
                                    href="#"
                                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={credential.password}
                                onChange={handleChange}
                            />
                        </div>
                        {formErrors.password && (
                            <p className="text-red-500 text-sm">{formErrors.password}</p>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <a
                        href="/Signup"
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                        Create account
                    </a>
                </p>
            </div>
        </div>
    );
}
