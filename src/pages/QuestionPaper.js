import { PencilIcon, FolderArrowDownIcon, ArrowUpRightIcon } from "@heroicons/react/24/solid";
import '../App.css';
import {
    Typography,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import { useGlobalContext } from "../utils/context";
import { useCallback, useEffect, useState } from "react";
import { createRoutesFromElements, Link } from "react-router-dom";
import debounce from "lodash/debounce";
import Pagination from "../components/Pagination.js";
import { toast } from "react-toastify";

const TABLE_HEAD = ["Course", "Department", "Semester", "Exam Type", "Subject", "Paper Code", "Year", "Preview"];

export default function QuestionPaperDashboard() {

    const { state } = useGlobalContext();
    const { role, name, email, _id } = state;
    const [questionPapers, setQuestionPapers] = useState([]);
    const [filters, setFilter] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNo, setPageNo] = useState(1);


    // debounce the search function
    const debouncedFetchQuestion = useCallback(
        debounce((filters, pageNo) => {
            fetchQuestionPaper(filters, pageNo)
        }, 500),
        []
    );

    // for handling page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber === currentPage) return;

        setCurrentPage(pageNumber);
        fetchQuestionPaper(filters, pageNumber);
    }

    // for handling search
    const handleFilterChange = (e) => {
        setFilter({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    // fetch the question paper on page mount
    useEffect(() => {
        fetchQuestionPaper({}, pageNo);
    }, []);

    // function for fetching question papers
    const fetchQuestionPaper = async (e, pageNo) => {
        try {
            let response = await fetch('http://localhost:5000/api/papers/questionPaperData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "limit": 5,
                    "page": pageNo,
                    "course": e.course,
                    "department": e.department,
                    "semester": e.semester,
                    "year": e.year,
                    "examType": e.examType,
                    "paperCode": e.paperCode,
                    "paperName": e.paperName
                })
            });

            if(!response){
                console.error("Error getting question paper data");
                toast.error('Error getting question paper data', {
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

            // parse Json
            const data = await response.json();
            setQuestionPapers(data?.data || []);
            setTotalPages(data?.pagination?.totalPages || 0);

        } catch (error) {
            console.error('Error fetching Questions data:', error);
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

    // handle the advance search
    const handleSearch = (e) => {
        e.preventDefault();
        debouncedFetchQuestion(filters, 1);  // trigger the debounce for search
        setPageNo(1);
    };

    // console.log("questionPapers", questionPapers);

    return (
        <>
            <div className="p-4 pb-0 text-lg font-medium leading-6 text-gray-900">Question Papers</div>

            <div className="m-4 shadow rounded overflow-auto">

                {/* Advance section */}
                <form onSubmit={handleSearch} className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4">
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
                        <label htmlFor="examType" className="block text-sm font-medium leading-6 text-gray-900">
                            Exam Type
                        </label>
                        <div className="mt-2">
                            <select
                                id="examType"
                                name="examType"
                                autoComplete="examType-name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.examType}
                            >
                                <option value="" selected>Please Select Exam Type</option>
                                <option value={"Mid-Term I"}>Mid-Term I</option>
                                <option value={"Mid-Term II"}>Mid-Term II</option>
                                <option value={"End-Sem"}>End-Sem</option>

                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="paperCode" className="block text-sm font-medium leading-6 text-gray-900">
                            Paper Code
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="paperCode"
                                id="paperCode"
                                autoComplete="paperCode"
                                placeholder="Please enter paper code"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.paperCode}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="paperName" className="block text-sm font-medium leading-6 text-gray-900">
                            Paper Name
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="paperName"
                                id="paperName"
                                autoComplete="paperName"
                                placeholder="Please enter paper name"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                onChange={handleFilterChange}
                                value={filters.paperName}
                            />
                        </div></div>
                    <div className="lg:col-span-2 flex space-x-3">
                        <div>
                            <button
                                type="submit"
                                className="mt-8 rounded-md bg-indigo-600 customButton text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Search
                            </button>
                        </div>
                        {role === "admin" &&
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
                        }
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

                            {questionPapers && questionPapers.length > 0 ? (
                                questionPapers.map(
                                    (
                                        {
                                            _id,
                                            course,
                                            department,
                                            semester,
                                            examType,
                                            paperName,
                                            paperCode,
                                            year,
                                            questionPaper,
                                        },
                                        index,
                                    ) => {
                                        const isLast = index === questionPapers.length - 1;
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
                                                        {examType ? examType : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {paperName ? paperName : "-"}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {paperCode ? paperCode : "-"}
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
    );
}