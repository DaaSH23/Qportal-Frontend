import { PencilIcon, FolderArrowDownIcon, ArrowUpRightIcon } from "@heroicons/react/24/solid";
import '../App.css';
import {
    Typography,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useGlobalContext } from "../utils/context";
import debounce from 'lodash/debounce';
import Pagination from "../components/Pagination.js";
import { toast } from "react-toastify";

const TABLE_HEAD = ["Firstname", "Lastname", "Email", "Phone", "Gender", "Role", "Actions"];

export function UserManagement() {

    const { state } = useGlobalContext();
    const { role, name, email, _id } = state;
    const [userData, setUserData] = useState([]);
    const [filters, setFilters] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        role: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNo, setPageNo] = useState();

    // Debounced search function
    const debouncedFetchUsers = useCallback(
        debounce((filters, pageNo) => {
            fetchUsers(filters, pageNo);
        }, 500), // 500ms delay
        []
    );

    // handle changes in the filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    // When component mount for the first time
    useEffect(() => {
        fetchUsers({}, pageNo);
    }, []);

    const fetchUsers = async (e, pageNo) => {
        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    "limit": 5,
                    "page": pageNo,
                    "firstName": e.firstname,
                    "lastName": e.lastname,
                    "email": e.email,
                    "phoneNumber": e.phoneNumber,
                    "role": e.role,
                    "rollNumber": e.rollNumber,
                    "facultyCode": e.facultyCode
                })
            });

            if (!response.ok) {
                // throw new Error(`Error fetching! status: ${response.status}`);
                console.error("Error getting user data");
                toast.error('Error getting user data', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

            const data = await response.json();
            // console.log("data: ",data);
            setUserData(data.data || []);
            setTotalPages(data.pagination.totalPages || 1);

        } catch (err) {
            console.error("Error fetching user information", err);
            toast.error('Internal Server error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    // handle advance search 
    const handleSubmit = (e) => {
        e.preventDefault(); 
        debouncedFetchUsers(filters, 1); // Trigger search
        setPageNo(1);
    };

    const handlePageChange = (pageNumber) => {
        // Prevent unnecessary API calls
        if (pageNumber === currentPage) return;

        setCurrentPage(pageNumber);
        fetchUsers(filters, pageNumber);
    };

    return (
        <>
            <div className="p-4 pb-0 text-lg font-medium leading-6 text-gray-900">User Management</div>

            <div className="m-4 shadow rounded overflow-auto">

                {/* Advance section */}
                <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4">

                    <div>
                        <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">
                            Firstname
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="firstname"
                                id="firstname"
                                autoComplete="firstname"
                                placeholder="Please enter firstname"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.firstname}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-900">
                            Lastname
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="lastname"
                                id="lastname"
                                autoComplete="lastname"
                                placeholder="Please enter lastname"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.lastname}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                placeholder="Please enter email"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.email}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                            Phone
                        </label>
                        <div className="mt-2">
                            <input
                                type="phone"
                                name="phone"
                                id="phone"
                                autoComplete="phone"
                                placeholder="Please enter phone"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.phone}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                            Role
                        </label>
                        <div className="mt-2">
                            <select
                                id="role"
                                name="role"
                                autoComplete="role"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.role}
                            >
                                <option value="" selected>Please Select Role</option>
                                <option value={"student"}>Student</option>
                                <option value={"teacher"}>Teacher</option>
                                <option value={"Admin"}>Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="lg:col-span-2 flex space-x-3">
                        <div>
                            <button
                                type="submit"
                                className="mt-8 rounded-md bg-indigo-600 customButton text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Search
                            </button>
                        </div>
                        {/* {role === "admin" && */}
                        <div class="md:col-span-2 justify-self-end">
                            <a href="/home/AddQuestion-Paper">
                                <button
                                    type="submit"
                                    className="mt-8 pl-4 rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Add Question Paper

                                    <IconButton variant="text" style={{ color: "white" }}>
                                        <ArrowUpRightIcon className="h-4 w-4" />
                                    </IconButton>

                                </button>
                            </a>
                        </div>
                        {/* } */}
                    </div>
                </form>

                <div className="overflow-x-auto overflow-y-auto text-center">
                    <table className="min-w-full">
                        <thead className="sticky top-0 z-1 bg-white">
                            <tr className="">
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className=" bg-blue-gray-50/50 pt-3"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>

                            {userData && userData.length > 0 ? (
                                userData.map(
                                    (
                                        {
                                            _id,
                                            firstName,
                                            lastName,
                                            email,
                                            phoneNumber,
                                            gender,
                                            role,
                                        },
                                        index,
                                    ) => {
                                        const isLast = index === userData.length - 1;
                                        const classes = isLast
                                            ? "p-4"
                                            : "p-4 border-b border-blue-gray-50";

                                        return (
                                            <tr key={_id}>

                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {firstName ? firstName:"-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {lastName ? lastName : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {email ? email : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {phoneNumber ? phoneNumber : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {gender ? gender : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {role ? role : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Tooltip content="Edit">
                                                        <IconButton variant="text">
                                                            <Link to={`/home/AddQuestion-Paper/${encodeURIComponent(_id)}`}>
                                                                <PencilIcon className="h-4 w-4" />
                                                            </Link>
                                                        </IconButton>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )
                            ) : (
                                <tr>
                                    <td colSpan="8" className="p-4 text-center text-blue-gray-400">
                                        No results found
                                    </td>
                                </tr>
                            )}

                        </tbody>
                        <tfoot className="sticky bottom-0 z-1 bg-white">
                            <tr>
                                <td colSpan={8} className="text-center p-2">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPage={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    )
}


export default UserManagement;