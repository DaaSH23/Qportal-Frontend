import React, { useCallback, useEffect, useState } from 'react'
import "../App.css";
import { PencilIcon, FolderArrowDownIcon, ArrowUpRightIcon } from "@heroicons/react/24/solid";
import {
    Typography,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useGlobalContext } from '../utils/context';
import { toast } from 'react-toastify';
import debounce from "lodash/debounce";
import Pagination from '../components/Pagination.js';


const TABLE_HEAD = ["Course", "Department", "Semester", "Subject", "Year", "Preview"];

export default function StudyNotesDashboard() {

    const { state } = useGlobalContext();        // from global state
    const { isLoggedIn, role } = state;
    const [studyNotes, setStudyNotes] = useState([]);
    const [filters, setFilter] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNo, setPageNo] = useState(1);

    // debounce the search function
    const debouncedFetchNotes = useCallback(
        debounce((filters, pageNo) => {
            fetchStudyNotes(filters, pageNo)
        }, 500),        // 5ms delay after each request
        []
    )

    // for handling the change in the page no.
    const handlePageChange = (pageNumber) => {
        if (pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
            fetchStudyNotes(filters, pageNumber);
        }
    }

    // handling the filter change in advance search
    const handleFilterChange = (e) => {
        setFilter({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    // handle advance search
    const handleSearch = (e) => {
        e.preventDefault();
        debouncedFetchNotes(filters, 1);
        setPageNo(1);
    }

    // fetch the notes on page mount
    useEffect(() => {
        fetchStudyNotes({}, 1);
    }, []);

    // function for fetching study notes
    const fetchStudyNotes = async (e, pageNo) => {
        try {
            let response = await fetch('http://localhost:5000/api/notes/getnotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "limit": 5,
                    "page": pageNo,
                    "subject": e.subject,
                    "year": e.year,
                    "semester": e.semester,
                    "department": e.department,
                    "course": e.course
                }),
            });

            // console.log("response: ", response);

            // response = await response.json();
            if (!response.ok) {
                toast.error('Error getting notes data', {
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

            // Parse JSON
            const data = await response.json();
            // console.log("data: ", data);


            // Handle the response data
            setStudyNotes(data.data || []);
            setTotalPages(data.pagination?.totalNotesPages || 0);

        } catch (err) {
            console.error("Error fetching Study notes: ", err);
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
            <div className="p-4 ml-2 pb-0 text-lg font-medium leading-6 text-gray-900">{`Study Notes`}</div>

            <div className="m-4 shadow rounded overflow-auto">
                {/* Advance Search */}
                <form onSubmit={handleSearch} className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-900">
                            Subject
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                autoComplete="subject"
                                placeholder="Please Enter Subject"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.subject}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium leading-6 text-gray-900">
                            Year
                        </label>
                        <div className="mt-2">
                            <select
                                id="year"
                                name="year"
                                autoComplete="year"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.year}
                            >
                                <option value="" selected>Please Select Year</option>
                                <option value={"2020"}>2020</option>
                                <option value={"2021"}>2021</option>
                                <option value={"2022"}>2022</option>
                                <option value={"2023"}>2023</option>
                                <option value={"2024"}>2024</option>

                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="semester" className="block text-sm font-medium leading-6 text-gray-900">
                            Semester
                        </label>
                        <div className="mt-2">
                            <select
                                id="semester"
                                name="semester"
                                autoComplete="semester-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.semester}
                            >
                                <option value="" selected>Please Select semester</option>
                                <option value={"I"}>I</option>
                                <option value={"II"}>II</option>
                                <option value={"III"}>III</option>
                                <option value={"IV"}>IV</option>
                                <option value={"V"}>V</option>
                                <option value={"VI"}>VI</option>
                                <option value={"VII"}>VII</option>
                                <option value={"VIII"}>VIII</option>

                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium leading-6 text-gray-900">
                            Department
                        </label>
                        <div className="mt-2">
                            <select
                                id="department"
                                name="department"
                                autoComplete="department-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.department}
                            >
                                <option value="" selected>Please Select department</option>
                                <option value={"IT"}>Information Technology</option>
                                <option value={"CSE"}>Computer Science & Engineering</option>
                                <option value={"CT"}>Ceramic Technology</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="course" className="block text-sm font-medium leading-6 text-gray-900">
                            Course
                        </label>
                        <div className="mt-2">
                            <select
                                id="course"
                                name="course"
                                autoComplete="course-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.course}
                            >
                                <option value="" selected>Please Select course</option>
                                <option value={"Btech"}>B-tech</option>
                                <option value={"Mtech"}>M-tech</option>
                            </select>
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

                            {studyNotes && studyNotes.length > 0 ? (
                                studyNotes.map(
                                    (
                                        {
                                            _id,
                                            course,
                                            department,
                                            semester,
                                            subject,
                                            year,
                                            questionPaper,
                                        },
                                        index,
                                    ) => {
                                        const isLast = index === studyNotes.length - 1;
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
                                                        {course ? course : "-"}
                                                    </Typography>
                                                    {/* </div> */}
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {department ? department : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {semester ? semester : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {subject ? subject : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {year ? year : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    {/* <div className="flex items-center gap-3 mb-2"> */}
                                                    <Tooltip content="Download">
                                                        <IconButton variant="text">
                                                            <a href={questionPaper}><FolderArrowDownIcon className="h-4 w-4" /></a>
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
};
