import React from "react";
import MultiLevelSidebar from "../components/Sidebar.js";
import { StickyNavbar } from '../components/Navbar.js';
import { Breadcrumb } from '../components/BreadCrumbs.js';
import { Routes, Route, useParams, useLocation } from "react-router-dom";
import Profile from "./Profile.js";
import QuestionPaperDashboard from "./QuestionPaper.js";
// import { AppProvider } from "../utils/context.js";
import AddQuestionPaper from "./AddQPaper.js";
import StudyNotesDashboard from "./StudyNotes.js";
import AddStudyNotes from "./AddSNotes.js"
import UserManagement from "./UserManagement.js";
import RoleManagementDashboard from "./RoleManagement.js";

function Home() {
    return (
        <>
            <div className="flex h-screen">
                <MultiLevelSidebar />
                <div className="w-full flex flex-col">
                    <StickyNavbar />
                    <Routes>
                        <Route path='/' element={<Breadcrumb />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/QuestionPaperDashboard' element={<QuestionPaperDashboard />} />
                        <Route path='/AddQuestion-Paper/*' element={<AddQuestionPaperWrapper />} />
                        <Route path='/StudyNotesDashboard' element={<StudyNotesDashboard />} />
                        <Route path='/AddStudyNotes/*' element={<AddStudyNotes />} />
                        <Route path='/admin/usermanagement/*' element={<UserManagement />} />
                        <Route path='/admin/rolemanagement/*' element={<RoleManagementDashboard />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

function AddQuestionPaperWrapper() {
    const location = useLocation();
    const _id = location.pathname.split('/AddQuestion-Paper/')[1];
    return <AddQuestionPaper _id={decodeURIComponent(_id)} />;
}

export default Home; 