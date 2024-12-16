import React, { useCallback, useEffect, useState } from "react";
import "../App.css";
import { PencilIcon, FolderArrowDownIcon, ArrowUpRightIcon } from "@heroicons/react/24/solid";
import {
    Typography,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useGlobalContext } from "../utils/context";
import Pagination from "../components/Pagination.js";
import debounce from "lodash/debounce";

const TABLE_HEAD = ["Role Id", "Role Name", "Permission Id", "Status", "Actions"];

export default function RoleManagementDashboard() {

    // Global context
    const { state } = useGlobalContext();
    const { role } = state;

    const [filters, setFilter] = useState({});
    const [permissions, setPermission] = useState([]);
    const [roleData, setRoleData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNo, setPageNo] = useState(1);


    // fetch permission & Role on page mount
    useEffect(() => {
        // FetchPermission();
        FetchRole({}, 1);
    }, []);

    // debounce the search function
    const debounceFetchRole = useCallback(
        debounce((filters, pageNo) => {
            FetchRole(filters, pageNo);
        }, 500),        // 5ms delay after each request
        []
    )

    // handle filter change 
    const handleFilterChange = (e) => {
        setFilter({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    // for handling page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
            FetchRole(filters, pageNumber);
        }
    }

    // for handling advance search
    const handleSearch = (e) => {
        e.preventDefault();
        debounceFetchRole(filters, 1);
        setPageNo(1);
    }

    //fetch permission
    // const FetchPermission = async () => {
    //     try {
    //         let response = await fetch('http://localhost:5000/api/permission/getpermission', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (!response) {
    //             toast.error("Error fetching permissions", {
    //                 position: "top-right",
    //                 autoClose: 5000,
    //                 hideProgressBar: false,
    //                 closeOnClick: true,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //                 theme: "light",
    //             });
    //         };

    //         const data = await response.json();

    //         setPermission(data.data || []);
    //     } catch (error) {
    //         console.error('Internal server error, Error fetching permission');
    //         toast.error('Internal Server error', {
    //             position: "top-right",
    //             autoClose: 5000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "light",
    //         });
    //     }
    // }

    const FetchRole = async (e, pageNo) => {
        try {
            let response = await fetch('http://localhost:5000/api/role/getrole', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "limit": 5,
                    "page": pageNo,
                    "roleId": e.roleId,
                    "roleName": e.roleName
                }),
            });


            if (!response) {
                console.error("Error getting role data");
                toast.error('Error getting role data', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            };

            const data = await response.json();

            console.log(data);

            setRoleData(data.data || []);
            setTotalPages(data.pagination?.totalPages || 0);
        } catch (err) {
            console.error("Internal server error: ", err);
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
    }


    return (
        <>
            <div className="p-4 ml-2 pb-0 text-lg font-medium leading-6 text-gray-900">{`Role Management`}</div>

            <div className="m-4 shadow rounded overflow-auto">
                {/* Advance Search */}
                <form onSubmit={handleSearch} className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4">
                    <div>
                        <label htmlFor="roleId" className="block text-sm font-medium leading-6 text-gray-900">
                            Role Id
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="roleId"
                                id="roleId"
                                autoComplete="roleId"
                                placeholder="Please Enter Role Id"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.roleId}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="roleName" className="block text-sm font-medium leading-6 text-gray-900">
                            Role Name
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="roleName"
                                name="roleName"
                                autoComplete="roleName"
                                placeholder="Please enter the Role name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.roleName}
                            />
                        </div>
                    </div>
                    <div className='flex'>
                        <div>
                            <button
                                type="submit"
                                className="mt-8 rounded-md bg-indigo-600 customButton text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>
                        {/* {role === "Admin" && */}
                        <div class="md:col-span-2 justify-self-end ml-2">
                            <a href="/home/AddQuestion-Paper">
                                <button
                                    type="submit"
                                    className="mt-8 pl-4 rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Add Study Notes

                                    <IconButton variant="text" style={{ color: "white" }}>
                                        <ArrowUpRightIcon className="h-4 w-4" />
                                    </IconButton>

                                </button>
                            </a>
                        </div>
                        {/* } */}
                    </div>
                </form>

                {/* divider */}
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
                        <tbody className='items-center'>

                            {roleData && roleData.length > 0 ? (
                                roleData.map(
                                    (
                                        {
                                            _id,
                                            roleId,
                                            roleName,
                                            permissionIds,
                                            isActive
                                        },
                                        index,
                                    ) => {
                                        const isLast = index === roleData.length - 1;
                                        const classes = isLast
                                            ? "p-4"
                                            : "p-4 border-b border-blue-gray-50";

                                        return (
                                            <tr key={_id}>
                                                <td className={classes}>
                                                    {/* <div className="flex items-center gap-3"> */}
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-bold"
                                                    >
                                                        {roleId ? roleId : "-"}
                                                    </Typography>
                                                    {/* </div> */}
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {roleName ? roleName : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {/* {permissionIds ? permissionIds : "-"} */}
                                                        {permissionIds && (
                                                            permissionIds.map((permission) => (
                                                                <p key={permission.permissionId} className="bg-orange-100">{permission.permissionName}</p>
                                                            ))
                                                        )}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {isActive ? "Active" : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    {/* <div className="flex items-center gap-3 mb-2"> */}
                                                    <Tooltip content="Download">
                                                        <IconButton variant="text">
                                                            {/* <a href={questionPaper}><FolderArrowDownIcon className="h-4 w-4" /></a> */}
                                                        </IconButton>
                                                    </Tooltip>
                                                    {role === "admin" &&
                                                        <Tooltip content="Edit">
                                                            <IconButton variant="text">
                                                                <Link to={`/home/AddQuestion-Paper/${encodeURIComponent(_id)}`}>
                                                                    <PencilIcon className="h-4 w-4" />
                                                                </Link>
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                    {/* </div> */}
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
                            <tr className="p-2">
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