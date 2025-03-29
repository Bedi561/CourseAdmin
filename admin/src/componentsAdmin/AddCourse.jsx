/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { 
  FaBook, 
  FaDollarSign, 
  FaImage, 
  FaMap,
  FaTags, 
  FaClock, 
  FaTrash, 
  FaPlus, 
  FaCheck, 
  FaFileUpload,
  FaFilePdf,
  FaVideo,
  FaLink
} from 'react-icons/fa';
import { BASE_URL } from "../config.js";
import Appbar from "./Appbar.jsx";
import Modal from "./Modal.jsx";

function AddCourse() {
    const [course, setCourse] = useState({
        title: "",
        description: "",
        price: 0,
        imageLink: "",
        published: false,
        category: "",
        tags: "",
        lessons: [{ title: "", content: "", duration: 0, videoLink: "", videoFile: null, pdfFile: null }],
        roadmap: [{milestone: "",
            description: "",
            lessonsIncluded: [Number], // References lesson indices
            projectDeliverables: "",
            estimatedCompletionTime: ""}],
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const steps = [
        { title: "Course Details", icon: <FaBook /> },
        { title: "Content & Media", icon: <FaVideo /> },
        { title: "Roadmap", icon: <FaMap /> },                  
        { title: "Lessons", icon: <FaFilePdf /> }
    ];

    const validateStep = (step) => {
        const newErrors = {};
        
        if (step === 0) {
            if (!course.title.trim()) newErrors.title = "Title is required";
            if (!course.description.trim()) newErrors.description = "Description is required";
            if (course.price < 0) newErrors.price = "Price cannot be negative";
            if (!course.category.trim()) newErrors.category = "Category is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(activeStep)) {
            setActiveStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setActiveStep(prev => prev - 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourse(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleLessonChange = (index, field, value) => {
        const updatedLessons = [...course.lessons];
        updatedLessons[index] = { ...updatedLessons[index], [field]: value };
        setCourse(prev => ({ ...prev, lessons: updatedLessons }));
    };

    const addLesson = () => {
        setCourse(prev => ({
            ...prev,
            lessons: [...prev.lessons, { title: "", content: "", duration: 0, videoLink: "", videoFile: null, pdfFile: null }]
        }));
    };

    const deleteLesson = (index) => {
        const updatedLessons = [...course.lessons];
        updatedLessons.splice(index, 1);
        setCourse(prev => ({ ...prev, lessons: updatedLessons }));
    };

    const handleFileChange = (e, index, type) => {
        const { files } = e.target;
        if (!files[0]) return;
        
        const updatedLessons = [...course.lessons];
        if (type === 'video') {
            updatedLessons[index].videoFile = files[0];
            // Show file name in UI
            updatedLessons[index].videoFileName = files[0].name;
        } else if (type === 'pdf') {
            updatedLessons[index].pdfFile = files[0];
            // Show file name in UI
            updatedLessons[index].pdfFileName = files[0].name;
        }
        setCourse(prev => ({ ...prev, lessons: updatedLessons }));
    };

    const handleCourseImageChange = (e) => {
        const { files } = e.target;
        if (files[0]) {
            setCourse(prev => ({ 
                ...prev, 
                imageFile: files[0],
                imageFileName: files[0].name,
                // Keep the imageLink if it's already set or set it to empty
                imageLink: prev.imageLink || "" 
            }));
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(activeStep)) {
            return;
        }
    
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem("token");
    
            if (!token) {
                setIsSubmitting(false);
                setErrors({ general: "Authentication required. Please log in." });
                return;
            }
    
            const formData = new FormData();
            formData.append("title", course.title);
            formData.append("description", course.description);
            formData.append("price", course.price);
    
            // Handle image file or link
            if (course.imageFile) {
                formData.append("imageFile", course.imageFile);
            } else {
                formData.append("imageLink", course.imageLink);
            }
    
            formData.append("published", course.published);
            formData.append("category", course.category);
            formData.append("tags", course.tags);
    
            course.lessons.forEach((lesson, index) => {
                formData.append(`lesson[${index}][title]`, lesson.title);
                formData.append(`lesson[${index}][content]`, lesson.content);
                formData.append(`lesson[${index}][duration]`, lesson.duration);
                formData.append(`lesson[${index}][videoLink]`, lesson.videoLink);
    
                if (lesson.videoFile) {
                    formData.append(`lesson[${index}][videoFile]`, lesson.videoFile);
                }
                if (lesson.pdfFile) {
                    formData.append(`lesson[${index}][pdfFile]`, lesson.pdfFile);
                }
            });
    
            // ✅ Ensure `roadmap` is not empty before looping
            if (course.roadmap && course.roadmap.length > 0) {
                course.roadmap.forEach((milestone, index) => {
                    formData.append(`roadmap[${index}][milestone]`, milestone.milestone);
                    formData.append(`roadmap[${index}][description]`, milestone.description);
                    formData.append(`roadmap[${index}][projectDeliverables]`, milestone.projectDeliverables);
                    formData.append(`roadmap[${index}][estimatedCompletionTime]`, milestone.estimatedCompletionTime);
                    formData.append(`roadmap[${index}][lessonsIncluded]`, milestone.lessonsIncluded.join(',')); 
                });
            } else {
                console.warn("No roadmap milestones added.");
            }
    
            console.log("Submitting Course Data:", course); // Debugging log
    
            // ✅ Remove incorrect 'Content-Type' (FormData handles it automatically)
            const uploadResponse = await axios.post(`${BASE_URL}/upload`, formData);
    
            if (uploadResponse.status === 200) {
                const courseResponse = await axios.post(`${BASE_URL}/courses`, formData, {
                    headers: { "Authorization": "Bearer " + token },
                });
    
                setIsModalOpen(true);
                setCourse({
                    title: "",
                    description: "",
                    price: 0,
                    imageLink: "",
                    published: false,
                    category: "",
                    tags: "",
                    lessons: [{ title: "", content: "", duration: 0, videoLink: "", videoFile: null, pdfFile: null }],
                    roadmap: [], // ✅ Reset roadmap after submission
                });
                setActiveStep(0);
            }
        } catch (error) {
            setErrors({ general: "Failed to add course. Please try again." });
            console.error("Error during course submission:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                                Course Title <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaBook className="text-gray-400" />
                                </div>
                                <input
                                    className={`pl-10 shadow appearance-none border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={course.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter an engaging course title"
                                />
                            </div>
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className={`shadow appearance-none border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                                id="description"
                                name="description"
                                value={course.description}
                                onChange={handleInputChange}
                                placeholder="What will students learn in this course?"
                                rows="4"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="price">
                                    Price <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FaDollarSign className="text-gray-400" />
                                    </div>
                                    <input
                                        className={`pl-10 shadow appearance-none border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                                        id="price"
                                        type="number"
                                        name="price"
                                        value={course.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="category">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={`shadow appearance-none border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                                    id="category"
                                    type="text"
                                    name="category"
                                    value={course.category}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Programming, Design, Business"
                                />
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="tags">
                                Tags
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaTags className="text-gray-400" />
                                </div>
                                <input
                                    className="pl-10 shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    id="tags"
                                    type="text"
                                    name="tags"
                                    value={course.tags}
                                    onChange={handleInputChange}
                                    placeholder="Enter comma-separated tags"
                                />
                            </div>
                            <p className="text-gray-500 text-xs mt-1">Separate tags with commas (e.g., javascript, beginner, web development)</p>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Course Thumbnail
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <FaLink className="text-gray-400" />
                                        </div>
                                        <input
                                            className="pl-10 shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            id="imageLink"
                                            type="text"
                                            name="imageLink"
                                            value={course.imageLink}
                                            onChange={handleInputChange}
                                            placeholder="Image URL (optional)"
                                        />
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1">OR</p>
                                </div>
                                
                                <div>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FaFileUpload className="w-8 h-8 mb-3 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span>
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleCourseImageChange}
                                            />
                                        </label>
                                    </div>
                                    {course.imageFileName && (
                                        <p className="text-sm text-gray-600 mt-2 overflow-hidden text-ellipsis">
                                            Selected: {course.imageFileName}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center mt-4">
                            <input
                                type="checkbox"
                                id="published"
                                name="published"
                                checked={course.published}
                                onChange={(e) => setCourse(prev => ({ ...prev, published: e.target.checked }))}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">
                                Publish this course immediately
                            </label>
                        </div>
                        <p className="text-gray-500 text-xs">Unpublished courses will be saved as drafts.</p>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Course Lessons</h3>
                            <button
                                type="button"
                                className="flex items-center py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                onClick={addLesson}
                            >
                                <FaPlus className="mr-2" />
                                Add Lesson
                            </button>
                        </div>
                        
                        {course.lessons.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-500">No lessons added yet. Click "Add Lesson" to create your first lesson.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {course.lessons.map((lesson, index) => (
                                    <div key={index} className="p-6 border rounded-lg bg-gray-50 shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium">Lesson {index + 1}</h4>
                                            <button
                                                type="button"
                                                className="flex items-center text-red-500 hover:text-red-700 transition duration-200"
                                                onClick={() => deleteLesson(index)}
                                            >
                                                <FaTrash className="mr-2" />
                                                Remove
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                                    Lesson Title <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                                    placeholder="What is this lesson about?"
                                                    value={lesson.title}
                                                    onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                                    Lesson Content <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                                    placeholder="Describe what students will learn in this lesson"
                                                    value={lesson.content}
                                                    onChange={(e) => handleLessonChange(index, 'content', e.target.value)}
                                                    rows="3"
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                                        Video Link
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                            <FaLink className="text-gray-400" />
                                                        </div>
                                                        <input
                                                            className="pl-10 shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                                            placeholder="YouTube, Vimeo, etc."
                                                            value={lesson.videoLink}
                                                            onChange={(e) => handleLessonChange(index, 'videoLink', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                                        <FaClock className="inline mr-2" />
                                                        Duration (minutes)
                                                    </label>
                                                    <input
                                                        className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                                        type="number"
                                                        min="0"
                                                        placeholder="How long is this lesson?"
                                                        value={lesson.duration}
                                                        onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                                        Upload Video
                                                    </label>
                                                    <div className="flex items-center justify-center w-full">
                                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <FaVideo className="w-6 h-6 mb-3 text-gray-400" />
                                                                <p className="mb-2 text-sm text-gray-500">
                                                                    <span className="font-semibold">Upload video file</span>
                                                                </p>
                                                                <p className="text-xs text-gray-500">MP4, WebM, etc.</p>
                                                            </div>
                                                            <input 
                                                                type="file" 
                                                                className="hidden"
                                                                accept="video/*" 
                                                                onChange={(e) => handleFileChange(e, index, 'video')}
                                                            />
                                                        </label>
                                                    </div>
                                                    {lesson.videoFileName && (
                                                        <p className="text-sm text-gray-600 mt-2 overflow-hidden text-ellipsis">
                                                            Selected: {lesson.videoFileName}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                                        Upload PDF Materials
                                                    </label>
                                                    <div className="flex items-center justify-center w-full">
                                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <FaFilePdf className="w-6 h-6 mb-3 text-gray-400" />
                                                                <p className="mb-2 text-sm text-gray-500">
                                                                    <span className="font-semibold">Upload PDF file</span>
                                                                </p>
                                                                <p className="text-xs text-gray-500">Resources, notes, etc.</p>
                                                            </div>
                                                            <input 
                                                                type="file" 
                                                                className="hidden"
                                                                accept=".pdf" 
                                                                onChange={(e) => handleFileChange(e, index, 'pdf')}
                                                            />
                                                        </label>
                                                    </div>
                                                    {lesson.pdfFileName && (
                                                        <p className="text-sm text-gray-600 mt-2 overflow-hidden text-ellipsis">
                                                            Selected: {lesson.pdfFileName}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            // Roadmap Component (Case 3 in renderStepContent)
case 3:
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Course Roadmap</h3>
                <button
                    type="button"
                    className="flex items-center py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    onClick={() => {
                        // Add a new empty roadmap milestone
                        setCourse(prev => ({
                            ...prev,
                            roadmap: [...(prev.roadmap || []), {
                                milestone: "",
                                description: "",
                                lessonsIncluded: [],
                                projectDeliverables: "",
                                estimatedCompletionTime: ""
                            }]
                        }));
                    }}
                >
                    <FaPlus className="mr-2" />
                    Add Milestone
                </button>
            </div>
            
            {(!course.roadmap || course.roadmap.length === 0) ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No roadmap milestones added yet. Click "Add Milestone" to create your first milestone.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {course.roadmap.map((milestone, index) => (
                        <div key={index} className="p-6 border rounded-lg bg-gray-50 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium">Milestone {index + 1}</h4>
                                <button
                                    type="button"
                                    className="flex items-center text-red-500 hover:text-red-700 transition duration-200"
                                    onClick={() => {
                                        // Remove this milestone
                                        const updatedRoadmap = [...course.roadmap];
                                        updatedRoadmap.splice(index, 1);
                                        setCourse(prev => ({ ...prev, roadmap: updatedRoadmap }));
                                    }}
                                >
                                    <FaTrash className="mr-2" />
                                    Remove
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Milestone Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        placeholder="What is this milestone about?"
                                        value={milestone.milestone}
                                        onChange={(e) => {
                                            const updatedRoadmap = [...course.roadmap];
                                            updatedRoadmap[index] = { ...updatedRoadmap[index], milestone: e.target.value };
                                            setCourse(prev => ({ ...prev, roadmap: updatedRoadmap }));
                                        }}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        placeholder="Describe what students will achieve in this milestone"
                                        value={milestone.description}
                                        onChange={(e) => {
                                            const updatedRoadmap = [...course.roadmap];
                                            updatedRoadmap[index] = { ...updatedRoadmap[index], description: e.target.value };
                                            setCourse(prev => ({ ...prev, roadmap: updatedRoadmap }));
                                        }}
                                        rows="3"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Project Deliverables
                                        </label>
                                        <input
                                            className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            placeholder="What will students create?"
                                            value={milestone.projectDeliverables}
                                            onChange={(e) => {
                                                const updatedRoadmap = [...course.roadmap];
                                                updatedRoadmap[index] = { ...updatedRoadmap[index], projectDeliverables: e.target.value };
                                                setCourse(prev => ({ ...prev, roadmap: updatedRoadmap }));
                                            }}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Estimated Completion Time (hours)
                                        </label>
                                        <input
                                            className="shadow appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                            type="number"
                                            min="0"
                                            placeholder="How long will this take?"
                                            value={milestone.estimatedCompletionTime}
                                            onChange={(e) => {
                                                const updatedRoadmap = [...course.roadmap];
                                                updatedRoadmap[index] = { ...updatedRoadmap[index], estimatedCompletionTime: e.target.value };
                                                setCourse(prev => ({ ...prev, roadmap: updatedRoadmap }));
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2">
                                        Associated Lessons
                                    </label>
                                    <div className="bg-white p-3 rounded-lg border border-gray-300">
                                        {course.lessons.length === 0 ? (
                                            <p className="text-gray-500 text-sm">Add lessons first to associate them with this milestone.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {course.lessons.map((lesson, lessonIndex) => (
                                                    <div key={lessonIndex} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`lesson-${index}-${lessonIndex}`}
                                                            checked={milestone.lessonsIncluded.includes(lessonIndex)}
                                                            onChange={(e) => {
                                                                const updatedRoadmap = [...course.roadmap];
                                                                let updatedLessons = [...updatedRoadmap[index].lessonsIncluded];
                                                                
                                                                if (e.target.checked) {
                                                                    if (!updatedLessons.includes(lessonIndex)) {
                                                                        updatedLessons.push(lessonIndex);
                                                                    }
                                                                } else {
                                                                    updatedLessons = updatedLessons.filter(id => id !== lessonIndex);
                                                                }
                                                                
                                                                updatedRoadmap[index] = { 
                                                                    ...updatedRoadmap[index], 
                                                                    lessonsIncluded: updatedLessons 
                                                                };
                                                                
                                                                setCourse(prev => ({ ...prev, roadmap: updatedRoadmap }));
                                                            }}
                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <label htmlFor={`lesson-${index}-${lessonIndex}`} className="ml-2 text-sm text-gray-700">
                                                            Lesson {lessonIndex + 1}: {lesson.title || "(Untitled)"}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="flex-1 flex flex-col overflow-hidden">
                <Appbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 py-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Create New Course</h2>
                            <p className="text-gray-600 mt-2">Fill in the details below to create your educational content</p>
                        </div>
                        
                        {/* Progress Stepper */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex flex-col items-center w-full">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                            activeStep > index 
                                                ? 'bg-green-500 text-white' 
                                                : activeStep === index 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {activeStep > index ? <FaCheck /> : step.icon}
                                        </div>
                                        <p className={`text-sm mt-2 ${activeStep === index ? 'font-medium text-blue-500' : 'text-gray-500'}`}>
                                            {step.title}
                                        </p>
                                        {index < steps.length - 1 && (
                                            <div className="hidden sm:block w-full bg-gray-200 h-0.5 mt-4">
                                                <div 
                                                    className="bg-blue-500 h-0.5" 
                                                    style={{ width: activeStep > index ? '100%' : '0%' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {errors.general && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                                <p>{errors.general}</p>
                            </div>
                        )}
                        
                        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-6">
                            {renderStepContent()}
                        </div>
                        
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={activeStep === 0}
                                className={`py-2 px-6 rounded-lg ${
                                    activeStep === 0 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                } transition duration-200`}
                            >
                                Back
                            </button>
                            
                            {activeStep < steps.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`flex items-center py-2 px-6 ${
                                        isSubmitting 
                                            ? 'bg-green-400 cursor-not-allowed' 
                                            : 'bg-green-500 hover:bg-green-600'
                                    } text-white rounded-lg transition duration-200`}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Create Course'}
                                    {!isSubmitting && <FaCheck className="ml-2" />}
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <FaCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Course Created Successfully!</h3>
                    <p className="text-gray-500">Your course has been added successfully.</p>
                </div>
            </Modal>
        </div>
    );
}

export default AddCourse;
