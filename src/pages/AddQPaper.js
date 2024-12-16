import React, { useEffect, useState } from "react";
import { PhotoIcon } from '@heroicons/react/24/solid';
import { toast } from "react-toastify";

export default function AddQuestionPaper({ _id }) {

    // const {paperCodeID} = useParams();
    // console.log(paperCodeID);

    const paperID = _id || null;

    const initialFormState = {
        course: "", department: "", semester: "", year: "", examType: "", paperCode: "", paperName: "",
    };

    const initialErrorState = {};

    const [formInputs, setFormInputs] = useState(initialFormState);
    const [formErrors, setFormErrors] = useState(initialErrorState);
    const [isSubmit, setIsSubmit] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState(null);

    // For fetch the previous paper data wrt to paperCode
    useEffect(() => {
        const fetchPaperData = async () => {
            try {
                if (paperID && paperID !== "undefined" && paperID !== null) {
                    const response = await fetch(`http://localhost:5000/api/questionPaperData?_id=${paperID}`);
                    const data = await response.json();
                    if (_id && data.paperData && data.paperData[0]) {
                        setFormInputs(prevInput => ({
                            ...prevInput,
                            ...data.paperData[0]
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchPaperData();
    }, [paperID]);

    // For saving the Paper data 
    useEffect(() => {
        const submitPaperData = async () => {
            if (Object.keys(formErrors).length === 0 && isSubmit) {
                const formData = new FormData();
                formData.append("course", formInputs.course);
                formData.append("department", formInputs.department);
                formData.append("semester", formInputs.semester);
                formData.append("year", formInputs.year);
                formData.append("examType", formInputs.examType);
                formData.append("paperCode", formInputs.paperCode);
                formData.append("paperName", formInputs.paperName);
                if (paperID) formData.append("id", paperID);

                if (selectedFiles) {
                    formData.append("file", selectedFiles);
                }

                console.log("FormData: ", formData);

                try {
                    const response = await fetch('/home/l', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        const errorMessage = await response.text();
                        // throw new Error(`Failed to submit the paper data: ${errorMessage}`);
                        console.log('Failed to submit the paper data: ', errorMessage);
                        toast.error('Failed to save the question paper', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });

                    } else {
                        toast.success('Question paper saved successfully', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });

                        setFormInputs(initialFormState);
                        setFormErrors(initialErrorState);
                        setSelectedFiles(null);
                        console.log('Data submitted successfully: ', formData);
                    }

                    // console.log('Data submitted successfully: ', formData);
                } catch (error) {
                    console.error('Error submitting data: ', error);
                    toast.error('Error submitting data', {
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
            setIsSubmit(false);
        };

        if (isSubmit) {
            submitPaperData();
        }
    }, [isSubmit, formErrors, formInputs, selectedFiles]);

    // console.log(formInputs);


    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setSelectedFiles(files[0]);
            setFormInputs(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormInputs(prev => ({ ...prev, [name]: value }));
        }
        setFormErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(formInputs);
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            setIsSubmit(true);
        }
    };

    // Validation states
    const validate = (values) => {
        const errors = {};
        if (!values.course) {
            errors.course = "Course is Required!";
        }
        if (!values.department) {
            errors.department = "Department is Required!";
        }
        if (!values.semester) {
            errors.semester = "Semester is Required!";
        }
        if (!values.year) {
            errors.year = "Year is Required!";
        }
        if (!values.examType) {
            errors.examType = "Exam Type is Required!";
        }
        if (!values.paperCode) {
            errors.paperCode = "Paper Code is Required!";
        }
        if (!values.paperName) {
            errors.paperName = "Paper Name is Required!";
        }
        if (!_id && !selectedFiles) {
            errors.quesPaper = "Question Paper is Required!";
        }
        return errors;
    }

    return (
        <div className="overflow-auto lg:pl-60 py-5 md:flex">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-0">
                        <h2 className="font-semibold leading-7 text-gray-900">Add Question Paper</h2>
                        <p className="mt-2 text-sm leading-7 text-gray-600">
                            Please provide all the relevant information to add question paper in the portal.
                        </p>
                    </div>

                    <div className="border-b border-gray-900/10 pb-5">

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                            <div className="sm:col-span-3">
                                <label htmlFor="course" className="block text-sm font-medium leading-6 text-gray-900">
                                    Course
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="course"
                                        name="course"
                                        autoComplete="course-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        onChange={handleChange}
                                        value={formInputs.course}
                                    >
                                        <option value={""} disabled selected>Please Select course</option>
                                        <option value={"Btech"}>B-tech</option>
                                        <option value={"Mtech"}>M-tech</option>
                                    </select>
                                </div>
                                {formErrors.course && <p className="text-red-500 text-sm">{formErrors.course}</p>}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="department" className="block text-sm font-medium leading-6 text-gray-900">
                                    Department
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="department"
                                        name="department"
                                        autoComplete="department-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        onChange={handleChange}
                                        value={formInputs.department}
                                    >
                                        <option value={""} disabled selected>Please Select department</option>
                                        <option value={"IT"}>Information Technology</option>
                                        <option value={"CSE"}>Computer Science & Engineering</option>
                                        <option value={"CT"}>Ceramic Technology</option>
                                    </select>
                                </div>
                                {formErrors.department && <p className="text-red-500 text-sm">{formErrors.department}</p>}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="semester" className="block text-sm font-medium leading-6 text-gray-900">
                                    Semester
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="semester"
                                        name="semester"
                                        autoComplete="semester-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        onChange={handleChange}
                                        value={formInputs.semester}
                                    >
                                        <option value={""} disabled selected>Please Select semester</option>
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
                                {formErrors.semester && <p className="text-red-500 text-sm">{formErrors.semester}</p>}
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="year" className="block text-sm font-medium leading-6 text-gray-900">
                                    Year
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="year"
                                        name="year"
                                        autoComplete="year"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        onChange={handleChange}
                                        value={formInputs.year}
                                    >
                                        <option value={""} disabled selected>Please Select Year</option>
                                        <option value={"2020"}>2020</option>
                                        <option value={"2021"}>2021</option>
                                        <option value={"2022"}>2022</option>
                                        <option value={"2023"}>2023</option>
                                        <option value={"2024"}>2024</option>

                                    </select>
                                </div>
                                {formErrors.year && <p className="text-red-500 text-sm">{formErrors.year}</p>}
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="examType" className="block text-sm font-medium leading-6 text-gray-900">
                                    Exam Type
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="examType"
                                        name="examType"
                                        autoComplete="examType-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        onChange={handleChange}
                                        value={formInputs.examType}
                                    >
                                        <option value={""} disabled selected>Please Select Exam Type</option>
                                        <option value={"Mid-Term I"}>Mid-Term I</option>
                                        <option value={"Mid-Term II"}>Mid-Term II</option>
                                        <option value={"End-Sem"}>End-Sem</option>

                                    </select>
                                </div>
                                {formErrors.examType && <p className="text-red-500 text-sm">{formErrors.examType}</p>}
                            </div>

                            <div className="sm:col-span-3">
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
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onChange={handleChange}
                                        value={formInputs.paperCode}
                                    />
                                </div>
                                {formErrors.paperCode && <p className="text-red-500 text-sm">{formErrors.paperCode}</p>}
                            </div>

                            <div className="sm:col-span-3">
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
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onChange={handleChange}
                                        value={formInputs.paperName}
                                    />
                                </div>
                                {formErrors.paperName && <p className="text-red-500 text-sm">{formErrors.paperName}</p>}

                            </div>

                            <div className="col-span-full">
                                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                    Question paper
                                </label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                    <div className="text-center">
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="quesPaper" type="file" className="sr-only" onChange={handleChange} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PDF, JPG, PNG up to 10MB</p>
                                    </div>
                                </div>
                                {formErrors.quesPaper && <p className="text-red-500 text-sm">{formErrors.quesPaper}</p>}
                                {selectedFiles && <p className="mt-2 text-sm text-gray-500">{selectedFiles.name}</p>}
                            </div>

                        </div>
                    </div>
                </div>

                <div className="mt-6 pb-5 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}