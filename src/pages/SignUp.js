import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {

    const navigate = useNavigate();

    const initialState = { firstName: "", lastName: "", email: "", phone: "", loginType: "", rollNumber: "", facultyCode: "", createPass: "", confirmPass: "", gender: "" };

    const [formValues, setFormValues] = useState(initialState);
    const [formErrors, setformErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });

        if (formErrors[name]) {
            setformErrors({ ...formErrors, [name]: "" });
        }
    }
    // 
    const collectData = (e) => {
        e.preventDefault();
        setformErrors(validate(formValues));
        setIsSubmit(true);
    }

    useEffect(() => {
        const submitForm = async () => {
            if (Object.keys(formErrors).length === 0 && isSubmit) {
                const userData = {
                    "firstName": formValues.firstName,
                    "lastName": formValues.lastName,
                    "email": formValues.email,
                    "phoneNumber": formValues.phone,
                    "role": formValues.loginType,
                    "rollNumber": formValues.rollNumber,
                    "facultyCode": formValues.facultyCode,
                    "gender": formValues.gender,
                    "password": formValues.confirmPass
                };

                try {
                    const response = await fetch('api/CreateUser/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData)
                    });

                    console.log(response);

                    if (!response.ok) {
                        const errorMessage = await response.text(); // Extract error message from response
                        throw new Error(`Failed to submit data: ${errorMessage}`);
                    } else if (response.ok) {
                        setTimeout(() => {
                            navigate("/login");
                        }, 5000);
                    }

                    console.log('Data submitted successfully:', userData);
                } catch (error) {
                    console.error('Error submitting data: ', error);
                }
            }
        };
        if (isSubmit) {
            submitForm();
            setIsSubmit(false);
        }

    }, [formErrors, formValues, isSubmit, navigate]);

    const validate = (values) => {
        const error = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i;

        if (!values.firstName) {
            error.firstName = "Firstname is required!";
        }

        if (!values.lastName) {
            error.lastName = "Lastname is required!";
        }

        if (!values.email) {
            error.email = "Email address is required!";
        }else if (!emailRegex.test(values.email)) {
            error.email = "Invalid email address!";
            console.log("Email validation failed:", values.email);
        }

        if (!values.phone) {
            error.phone = "Phone is required!";
        }

        if (!values.loginType) {
            error.loginType = "Login type is required!";
        } else if (values.loginType === "Student") {
            if (!values.rollNumber) {
                error.rollNumber = "Roll number is required!";
            }
        } else if (values.loginType === "Teacher") {
            error.facultyCode = "Faculty code is required!"
        }

        if (!values.gender) {
            error.gender = "Gender is required!";
        }

        if (!values.createPass) {
            error.createPass = "Password is required!";
        } else if (!passwordRegex.test(values.createPass)) {
            error.createPass = "Minimum 8 characters, should contain uppercase, lowercase letters, numbers and special characters"
        }
        if (!values.confirmPass) {
            error.confirmPass = "Please confirm the password!";
        } else if (values.createPass !== values.confirmPass) {
            error.confirmPass = "Password do not match!"
        }

        return error;
    }

    return (
        <form className="w-full md:w-[800px] p-4 md:px-0 mx-auto" onSubmit={collectData}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900  mt-8">Create Profile</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        This information will not be displayed publicly.
                    </p>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                        <div className="sm:col-span-3">
                            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                                First name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Enter First Name"
                                    value={formValues.firstName}
                                    onChange={handleChange}
                                />

                            </div>
                            {formErrors.firstName && <p className="text-red-500 text-sm">{formErrors.firstName}</p>}
                        </div>
                        {/* <p>{formErrors.firstName}</p> */}
                        <div className="sm:col-span-3">
                            <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                                Last name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    autoComplete="family-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Enter Last Name"
                                    value={formValues.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                            {formErrors.lastName && <p className="text-red-500 text-sm">{formErrors.lastName}</p>}
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email Address
                            </label>
                            <div className="mt-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    placeholder="abc@gcect.ac.in"
                                    value={formValues.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {<p className="text-red-500 text-sm">{formErrors.email}</p>}
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                Phone Number
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm pr-2">+91</span>
                                    <input
                                        type="number"
                                        name="phone"
                                        id="phone"
                                        autoComplete="phone"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="0000000000"
                                        value={formValues.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="loginType" className="block text-sm font-medium leading-6 text-gray-900">
                                Login Type
                            </label>
                            <div className="mt-2">
                                <select
                                    id="loginType"
                                    name="loginType"
                                    autoComplete="login-Type"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    value={formValues.loginType}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Login Type</option>
                                    <option>Student</option>
                                    <option>Teacher</option>
                                </select>
                            </div>
                            {formErrors.loginType && <p className="text-red-500 text-sm">{formErrors.loginType}</p>}
                        </div>
                        {formValues.loginType === "Student" && (
                            <>
                                <div className="sm:col-span-3" >
                                    <label htmlFor="rollNumber" className="block text-sm font-medium leading-6 text-gray-900">
                                        Roll Number
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="rollNumber"
                                            id="rollNumber"
                                            autoComplete="rollNumber"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="Enter Roll Number"
                                            value={formValues.rollNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {formErrors.rollNumber && <p className="text-red-500 text-sm">{formErrors.rollNumber}</p>}
                                </div>
                            </>
                        )}
                        {formValues.loginType === "Teacher" && (
                            <>
                                <div className="sm:col-span-3">
                                    <label htmlFor="facultyCode" className="block text-sm font-medium leading-6 text-gray-900">
                                        Faculty Code
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="facultyCode"
                                            id="facultyCode"
                                            autoComplete="faculty-code"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="Enter faculty Code"
                                            value={formValues.facultyCode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {formErrors.facultyCode && <p className="text-red-500 text-sm">{formErrors.facultyCode}</p>}
                                </div>
                            </>
                        )}

                        <div className="sm:col-span-3">
                            <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
                                Gender
                            </label>
                            <div className="mt-2">
                                <select
                                    id="gender"
                                    name="gender"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    value={formValues.gender}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Others</option>
                                </select>
                            </div>
                            {formErrors.gender && <p className="text-red-500 text-sm">{formErrors.gender}</p>}
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="createPass" className="block text-sm font-medium leading-6 text-gray-900">
                                Create Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="createPass"
                                    id="createPass"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Create Password"
                                    value={formValues.createPass}
                                    onChange={handleChange}
                                />
                            </div>
                            {formErrors.createPass && <p className="text-red-500 text-sm">{formErrors.createPass}</p>}
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="confirmPass" className="block text-sm font-medium leading-6 text-gray-900">
                                Confirm Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="confirmPass"
                                    id="confirmPass"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Confirm Password"
                                    value={formValues.confirmPass}
                                    onChange={handleChange}
                                />
                            </div>
                            {formErrors.confirmPass && <p className="text-red-500 text-sm">{formErrors.confirmPass}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Save</button>
            </div>
        </form>
    );
}

export default Signup;