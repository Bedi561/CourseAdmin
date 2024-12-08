import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { FaEdit, FaDollarSign } from 'react-icons/fa';
import { BASE_URL } from "../config.js";
import { courseState } from "../storeAdmin/atoms/course";
import { courseTitle, coursePrice, isCourseLoading, courseImage } from "../storeAdmin/selectors/course";
import Appbar from "./Appbar.jsx";
import Sidebar from "./Sidebar.jsx";

function Course() {
    let { courseId } = useParams();
    const setCourse = useSetRecoilState(courseState);
    const courseLoading = useRecoilValue(isCourseLoading);

    useEffect(() => {
        axios.get(`${BASE_URL}/course/${courseId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setCourse({isLoading: false, course: res.data.course});
        })
        .catch(e => {
            setCourse({isLoading: false, course: null});
        });
    }, [courseId, setCourse]);

    if (courseLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Appbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <GrayTopper />
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-2/3">
                                <UpdateCard />
                            </div>
                            <div className="md:w-1/3">
                                <CourseCard />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function GrayTopper() {
    const title = useRecoilValue(courseTitle);
    return (
        <div className="bg-gray-800 py-24">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-semibold text-white text-center">{title}</h1>
            </div>
        </div>
    );
}

function UpdateCard() {
    const [courseDetails, setCourse] = useRecoilState(courseState);
    const [title, setTitle] = useState(courseDetails.course.title);
    const [description, setDescription] = useState(courseDetails.course.description);
    const [image, setImage] = useState(courseDetails.course.imageLink);
    const [price, setPrice] = useState(courseDetails.course.price);

    const handleUpdate = async () => {
        try {
            await axios.put(`${BASE_URL}/courses/` + courseDetails.course._id, {
                title, description, imageLink: image, published: true, price
            }, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });
            let updatedCourse = {
                _id: courseDetails.course._id,
                title, description, imageLink: image, price
            };
            setCourse({course: updatedCourse, isLoading: false});
            alert("Course updated successfully!");
        } catch (error) {
            console.error("Error updating course:", error);
            alert("Failed to update course. Please try again.");
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Update Course Details</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full p-2 border rounded"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                    rows="3"
                />
                <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image Link"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price"
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={handleUpdate}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                    Update Course
                </button>
            </div>
        </div>
    );
}

function CourseCard() {
    const title = useRecoilValue(courseTitle);
    const imageLink = useRecoilValue(courseImage);
    const price = useRecoilValue(coursePrice);

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={imageLink} alt={title} className="w-full h-48 object-cover" />
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <div className="flex items-center text-gray-700">
                    <FaDollarSign className="mr-1" />
                    <span className="font-bold">{price}</span>
                </div>
            </div>
        </div>
    );
}

export default Course;

