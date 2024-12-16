import React from "react";
import '../App.css';

import {
    Drawer,
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    PowerIcon,
    BoltIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useGlobalContext, initialState } from "../utils/context";
import { toast } from "react-toastify";
// import { useGlobalContext } from "../utils/context";

export default function MultiLevelSidebar() {

    const { state } = useGlobalContext();
    const { _id } = state;

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [accordionOpen, setAccordionOpen] = React.useState(0);

    const handleAccordionOpen = (value) => {
        setAccordionOpen(accordionOpen === value ? 0 : value);
    };

    const openDrawer = () => setDrawerOpen(true);
    const closeDrawer = () => setDrawerOpen(false);

    const { dispatch } = useGlobalContext();


    const handleLogout = async (e) => {
        try {
            const response = await fetch(`/api/users/logout`, {
                method: 'GET',
            });
            if (response.ok) {
                toast.success("Logout Successful", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                dispatch({ type: "RESET_STATE", payload: initialState });
                setTimeout(()=>{
                    window.location.reload();
                }, 2000);
                console.log("logged out");
            } else {
                toast.error("Error Logging Out! try after some times", {
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
        } catch (error) {
            console.error('Error logging out: ', error);
            toast.error('Error Server issue', {
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
            <div className="hidden lg:flex h-screen w-full max-w-[20rem] shadow-inner flex-col">
                <Card floated={false} style={{ backgroundColor: "red" }} className="h-full sideBar1 p-3">
                    <div className=" p-4">
                        <Typography variant="h5" className="text-indigo-950">
                            Question Paper Portal
                        </Typography>
                    </div>
                    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                        <List className="flex-1">
                            <Accordion
                                open={accordionOpen === 1}
                                icon={
                                    <ChevronDownIcon
                                        strokeWidth={2.5}
                                        className={`mx-auto h-4 w-4 transition-transform ${accordionOpen === 1 ? "rotate-180" : ""}`}
                                    />
                                }
                            >
                                <ListItem className="p-0" selected={accordionOpen === 1}>
                                    <AccordionHeader onClick={() => handleAccordionOpen(1)} className="border-b-0 p-2">
                                        <ListItemPrefix className="mr-3">
                                            <PresentationChartBarIcon className="h-5 w-5" />
                                        </ListItemPrefix>
                                        <Typography color="blue-gray" className="mr-auto font-normal mt-2.5">
                                            Academics
                                        </Typography>
                                    </AccordionHeader>
                                </ListItem>
                                <AccordionBody className="py-1">
                                    <List className="p-0">
                                        <ListItem>
                                            <ListItemPrefix>
                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                            </ListItemPrefix>
                                            Previous Year Papers
                                        </ListItem>
                                        <ListItem>
                                            <ListItemPrefix>
                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                            </ListItemPrefix>
                                            Results
                                        </ListItem>
                                        <ListItem>
                                            <ListItemPrefix>
                                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                            </ListItemPrefix>
                                            Study Notes
                                        </ListItem>
                                    </List>
                                </AccordionBody>
                            </Accordion>

                            <ListItem>
                                <ListItemPrefix className="mr-3">
                                    <BoltIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                Connect
                            </ListItem>
                            <ListItem>
                                <ListItemPrefix className="mr-3">
                                    <UserCircleIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                Profile
                            </ListItem>
                            <ListItem>
                                <ListItemPrefix className="mr-3">
                                    <Cog6ToothIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                Settings
                            </ListItem>
                            {_id !== null &&
                                <ListItem onClick={handleLogout}>
                                    <ListItemPrefix className="mr-3">
                                        <PowerIcon className="h-5 w-5" />
                                    </ListItemPrefix>
                                    Log Out
                                </ListItem>
                            }
                        </List>
                    </div>
                </Card>
            </div>
            <div onClick={openDrawer} className="lg:hidden burgerMenu flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M3 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.25Zm0 4.5A.75.75 0 0 1 3.75 9h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Zm0 4.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                </svg>
            </div>
            <Drawer open={drawerOpen} onClose={closeDrawer} className="lg:hidden h-full">
                <div className="h-screen w-full max-w-[20rem] shadow-inner flex flex-col">
                    <Card style={{ backgroundColor: "red" }} className="h-full sideBar1 p-3">
                        <div className=" p-4">
                            <Typography variant="h5" className="text-indigo-950">
                                Question Paper Portal
                            </Typography>
                        </div>
                        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                            <List className="flex-1">
                                <Accordion
                                    open={accordionOpen === 1}
                                    icon={
                                        <ChevronDownIcon
                                            strokeWidth={2.5}
                                            className={`mx-auto h-4 w-4 transition-transform ${accordionOpen === 1 ? "rotate-180" : ""}`}
                                        />
                                    }
                                >
                                    <ListItem className="p-0" selected={accordionOpen === 1}>
                                        <AccordionHeader onClick={() => handleAccordionOpen(1)} className="border-b-0 p-3">
                                            <ListItemPrefix className="mr-3">
                                                <PresentationChartBarIcon className="h-5 w-5" />
                                            </ListItemPrefix>
                                            <Typography color="blue-gray" className="mr-auto font-normal mt-2.5">
                                                Dashboard
                                            </Typography>
                                        </AccordionHeader>
                                    </ListItem>
                                    <AccordionBody className="py-1">
                                        <List className="p-0">
                                            <ListItem>
                                                <ListItemPrefix>
                                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                                </ListItemPrefix>
                                                Previous Year Paper
                                            </ListItem>
                                            <ListItem>
                                                <ListItemPrefix>
                                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                                </ListItemPrefix>
                                                Result
                                            </ListItem>
                                            <ListItem>
                                                <ListItemPrefix>
                                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                                </ListItemPrefix>
                                                Notes
                                            </ListItem>
                                        </List>
                                    </AccordionBody>
                                </Accordion>

                                <ListItem>
                                    <ListItemPrefix className="mr-3">
                                        <BoltIcon className="h-5 w-5" />
                                    </ListItemPrefix>
                                    Connect
                                </ListItem>
                                <ListItem>
                                    <ListItemPrefix className="mr-3">
                                        <UserCircleIcon className="h-5 w-5" />
                                    </ListItemPrefix>
                                    Profile
                                </ListItem>
                                <ListItem>
                                    <ListItemPrefix className="mr-3">
                                        <Cog6ToothIcon className="h-5 w-5" />
                                    </ListItemPrefix>
                                    Settings
                                </ListItem>
                                {_id !== null &&
                                    <ListItem onClick={handleLogout}>
                                        <ListItemPrefix className="mr-3">
                                            <PowerIcon className="h-5 w-5" />
                                        </ListItemPrefix>
                                        Log Out
                                    </ListItem>
                                }
                            </List>
                        </div>
                    </Card>
                </div>

            </Drawer>
        </>
    );
}
