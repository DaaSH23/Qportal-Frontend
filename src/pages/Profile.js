import React, { useEffect, useState } from "react";
import '../App.css';
import { ReactComponent as PP1 } from '../Assests/undraw_female_avatar_efig.svg';
import { ReactComponent as PP2 } from '../Assests/undraw_male_avatar_g98d.svg';
import { useGlobalContext } from "../utils/context";
// import BasicAlerts from "../components/AlertBar.js";

export default function Profile() {

    const [profileData, setProfileData] = useState(null);
    const {state} = useGlobalContext();
    const {_id, role}=state;

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async (e) => {
        try {
            await fetch('http://localhost:5000/api/users/profile', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "limit": 5,
                    "_id": _id
                    // "page": pageNo,
                    // "firstname": e.firstname,
                    // "lastname": e.lastname,
                    // "email": e.email,
                    // "phoneNumber": e.phoneNumber,
                    // "role": e.role,
                    // "rollNumber": e.rollNumber,
                    // "facultyCode": e.facultyCode
                })

            })
                .then(response => response.json())
                .then(data => {
                    setProfileData(data.profileData);
                    console.log("Data : ", data);
                })
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    }

    // const EditUser = async (e) =>{
    //     try{

    //     }catch(error) {

    //     }
    // }

    return (
        <>
            <div className="ProfileDesign h-full p-10 shadow-xl">
                <input
                    id="UserID"
                    type="hidden"
                    name="userId"
                    value={profileData && profileData._id} // Assuming your user object has an "_id" field
                />
                <div className="flex" style={{ color: "#64748b" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path fillrule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                    </svg>
                    <h5 className="pl-4">Profile Information</h5>
                </div>
                <div className="md:flex md:justify-center">
                    {/* w-fit text-center sm:ml-24 sm:mt-10 md:item-center*/}
                    <div className="w-fit text-center sm:ml-24 sm:mt-10 sm:item-center">
                        {profileData && profileData.gender === "Male" ? <PP2 /> : <PP1 />}
                        {/* <PP2 /> */}
                        <h6 className="mt-4" style={{ color: "#475569" }}>{profileData && profileData.firstName + " " + profileData.lastName}</h6>
                    </div>
                    <div className="w-full flex flex-col space-y-4 infoContent md:ml-16">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Name :
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={profileData && profileData.firstName + " " + profileData.lastName}
                                disabled="true"
                            />
                        </div>
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Email Address :
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={profileData && profileData.email}
                                disabled="true"
                            />
                        </div>
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Phone Number :
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={profileData && profileData.phoneNumber}
                                disabled="true"
                            />
                        </div>
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Account Type :
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={profileData && profileData.loginType}
                                disabled="true"
                            />
                        </div>
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Faculty Code :
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                autoComplete="given-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={profileData && profileData.facultyCode}
                                disabled="true"
                            />
                        </div>
                    </div>
                    {/* <div className="">
                            <button onClick={EditUser()}>Edit User</button>
                        </div> */}
                </div>

            </div>
        </>
    )
}