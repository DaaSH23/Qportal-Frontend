import React, { useEffect, useState } from "react";
import { FlagIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { toast } from "react-toastify";

export default function AddStudyNotes({ _id }) {

    const formInitialState = {
        subject: "",
        year: "",
        semester: "",
        department: "",
        course: "",
        notesName: ""
    }

    const errorInitialState = {};

    const [formInputs, setFormInputs] = useState(formInitialState)
    const [notesFile, setNotesFile] = useState(null);
    const [formError, setFormError] = useState(errorInitialState);
    const [isSubmit, setIsSubmit] = useState(false);

    const handleChange = (e) => {
        const { value, type, name, files } = e.target;
        if (type === 'file') {
            setNotesFile(files[0]);
            setFormInputs(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormInputs(prev => ({ ...prev, [name]: value }));
        }
        setFormError(prev => ({ ...prev, [name]: "" }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(formInputs);
        setFormError(errors);
        if (Object.keys(errors).length === 0) {
            setIsSubmit(true);
        }
    }

    //validation
    const validate = (values) => {
        const error = {}
        if (!values.subject) {
            error.subject = "Subject name required!";
        }
        if (!values.year) {
            error.year = "Year is required"
        }
        if (!values.semester) {
            error.semester = "Semester required";
        }
        if (!values.department) {
            error.department = "Department required";
        }
        if (!values.course) {
            error.course = "Course required";
        }
        if (!notesFile) {
            error.noteFile = "Note file required";
        }
        return error;
    }

    // For saving the Study notes
    useEffect(() => {
        const submitNotes = async () => {
            if(Object.keys(formError).length === 0 && isSubmit) {
                const formData = new FormData();
                formData.append("subject", formInputs.subject);
                formData.append("year", formInputs.year);
                formData.append("semester", formInputs.semester);
                formData.append("department", formInputs.department);
                formData.append("course", formInputs.course);
                if(notesFile) {
                    formData.append("file", notesFile);
                }

                try{
                    const response = await fetch(`http://localhost:5000/api/AddNotes`,{
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        const errorMessage = await response.text();
                        // throw new Error(`Failed to submit the paper data: ${errorMessage}`);
                        console.log('Failed to submit the study notes: ', errorMessage);
                        toast.error('Failed to save the study notes', {
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
                        toast.success('Study notes saved successfully', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });

                        setFormInputs(formInitialState);
                        setFormError(errorInitialState);
                        setNotesFile(null);
                        console.log('Data submitted successfully: ', formData);
                    }

                } catch(error){
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
        }

        if(isSubmit){
            submitNotes();
        }
    }, [isSubmit, formError, formInputs, notesFile]);

    return (
        <div className="overflow-auto lg:px-72 lg:py-12 item-center flex">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-0">
                        <h2 className="font-semibold leading-7 text-gray-900">Add Study Note</h2>
                        <p className="mt-2 text-sm leading-7 text-gray-600">
                            Please provide all the relevant information to add study notes in the portal.
                        </p>
                    </div>

                    <div className="border-b border-gray-900/10 pb-5">

                        <div className="mt-10 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">

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
                                        onChange={handleChange}
                                        value={formInputs.subject}
                                    />
                                </div>
                                {formError.subject && <p className="text-red-500 text-sm">{formError.subject}</p>}
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
                                        onChange={handleChange}
                                        value={formInputs.year}
                                    >
                                        <option value="" selected>Please Select Year</option>
                                        <option value={"2020"}>2020</option>
                                        <option value={"2021"}>2021</option>
                                        <option value={"2022"}>2022</option>
                                        <option value={"2023"}>2023</option>
                                        <option value={"2024"}>2024</option>

                                    </select>
                                </div>
                                {formError.year && <p className="text-red-500 text-sm">{formError.year}</p>}
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
                                        onChange={handleChange}
                                        value={formInputs.semester}
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
                                {formError.semester && <p className="text-red-500 text-sm">{formError.semester}</p>}
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
                                        onChange={handleChange}
                                        value={formInputs.department}
                                    >
                                        <option value="" selected>Please Select department</option>
                                        <option value={"IT"}>Information Technology</option>
                                        <option value={"CSE"}>Computer Science & Engineering</option>
                                        <option value={"CT"}>Ceramic Technology</option>
                                    </select>
                                </div>
                                {formError.department && <p className="text-red-500 text-sm">{formError.department}</p>}
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
                                        onChange={handleChange}
                                        value={formInputs.course}
                                    >
                                        <option value="" selected>Please Select course</option>
                                        <option value={"Btech"}>B-tech</option>
                                        <option value={"Mtech"}>M-tech</option>
                                    </select>
                                </div>
                                {formError.course && <p className="text-red-500 text-sm">{formError.course}</p>}
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                    Study Note 
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
                                {formError.noteFile && <p className="text-red-500 text-sm">{formError.noteFile}</p>}
                                {notesFile && <p className="mt-2 text-sm text-gray-500">{notesFile.name}</p>}
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