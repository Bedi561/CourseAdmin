// import React from "react";
// import { Typography, Grid, Paper, Box } from "@mui/material";
// import Admin from "./Admin";
// import DataTable from "react-data-table-component";
// import UserDropdown from "../stuff/Dropdown/UserDropdown";
// import Breadcrumb from "../stuff/Breadcrumb/Breadcrumb";
// import AuthDropdown from "../stuff/Dropdown/AuthDropdown";
// import Appbar from "./Appbar";
// import Sidebar from "./Sidebar";
// import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon from Material-UI

const Students = () => {
  const crumbs = [
    {
      title: "Students",
      path: "/admin/students",
    },
  ];

  // Dummy data for students
  const dummyStudents = [
    { name: "John Doe", email: "john@example.com", enrolledCourse: "Mathematics" },
    { name: "Jane Smith", email: "jane@example.com", enrolledCourse: "Science" },
    { name: "Alice Johnson", email: "alice@example.com", enrolledCourse: "History" },
    // Add more dummy student data here
  ];

   const columns = [
    {
      name: (
        <Typography variant="h4" className="font-semibold" style={{ textDecoration: 'underline' }}>
          Name
        </Typography>
      ),
      selector: (row) => (
        <Typography variant="body1">{row.name}</Typography>
      ),
      sortable: true,
    },
    {
      name: (
        <Typography variant="h4" className="font-semibold" style={{ textDecoration: 'underline' }}>
          Email
        </Typography>
      ),
      selector: (row) => (
        <Typography variant="body1">{row.email}</Typography>
      ),
      sortable: true,
    },
    {
      name: (
        <Typography variant="h4" className="font-semibold" style={{ textDecoration: 'underline' }}>
          Enrolled Course
        </Typography>
      ),
      selector: (row) => (
        <Typography variant="body1">{row.enrolledCourse}</Typography>
      ),
      sortable: true,
    },
    {
      name: (
        <Typography variant="h4" className="font-semibold" style={{ textDecoration: 'underline' }}>
          Action
        </Typography>
      ),
      cell: (row) => <UserDropdown id={row._id} />,
    },
  ];

  return (
    <React.Fragment>
      <Appbar/>
      <Sidebar/>
      <div className="flex items-center justify-between">
       

      </div>
      <div className="flex flex-col md:mt-10 sm:mt-5">
        <figure className="shadow-xl rounded-md overflow-y-visible border">
          <div className="p-6 bg-white grid md:grid-cols-2 sm:grid-cols-1 justify-between gap-5">
            <div style={{ marginBottom: '20px' }}>
              <Typography variant="h2" className="font-semibold">
                All Students
              </Typography>
              <Typography variant="h4" className="text-slate-500">
                List of all enrolled students
              </Typography>
            </div>

            <div className="flex justify-end">
              <Box height="fit-content"> {/* Add padding and set height */}
                <input
                  type="search"
                  className="input-md md:w-96 sm:w-full" // Adjust width here
                  style={{ height: '40px' }} // Adjust height here
                  placeholder="Search Student"
                  disabled // Disable search as we don't have search functionality
                />
              </Box>
            </div>

          </div>
          <div className="p-0 bg-slate-100 border-t table-div">
            <DataTable columns={columns} data={dummyStudents} pagination />
          </div>
        </figure>
      </div>
    </React.Fragment>
  );
};

Students.layout = Admin;

// export default Students;
