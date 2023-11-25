import React, { useState, ChangeEvent, FormEvent } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

interface FormData {
    name: string;
    room: string;
}

const MainForm: React.FC = () => {
    const navigate = useNavigate();

    const [error, setError] = useState < string > ("");
    const [data, setData] = useState < FormData > ({ name: "", room: "" });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const validation = (): boolean => {
        if (!data.name) {
            setError("Please enter your name.");
            toast.error("Please enter your name.")
            return false;
        }
        if (!data.room) {
            setError("Please select a room.");
            toast.error("Please select a room.")
            return false;
        }
        setError("");
        
        return true;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = validation();
        if (isValid) {
            
            navigate(`/chat/${data.room}`, { state: data });
            
        }
    };

    return (

        <div className="px-3 py-4 shadow bg-white text-dark border rounded row">
        <Toaster/>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                    <h2 className="text-warning mb-4 text-white">Welcome to Chatclub</h2>
                </div>
                <div className="form-group mb-4 border border-blue-500 rounded-md">
                    <input
                        type="text"
                        className="form-control bg-light border-none outline-none p-2"
                        name="name"
                        placeholder="Enter name"
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group border-blue-500  mb-4 ">
                    <select
                        className="form-select bg-gray-600 bg-light"
                        name="room"
                        aria-label="Default select example"
                        onChange={handleChange}
                    >
                        <option value="">Select Room</option>
                        <option value="gaming">Gaming</option>
                        <option value="coding">Coding</option>
                        <option value="socialMedia">Social Media</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-warning bg-blue-600 w-100 rounded-md w-24 mb-2">
                    Submit
                </button>
                {error && <small className="text-danger m-auto">{error}</small>}
            </form>
        </div>
    );
};

export default MainForm;
