import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Auth from "../utils/auth";
import { createResistance } from '../utils/API';
import Header from "./Header";
import resistanceIcon from "../assets/images/resistance-w.png"

export default function Track() {
    const [resistanceForm, setTrackForm] = useState({
        name: "",
        distance: "",
        time: "",
        date: ""

    })
    const [startDate, setStartDate] = useState(new Date());
    const [message, setMessage] = useState("");
    const loggedIn = Auth.isLoggedIn();

    const handleDateChange = date => {
        setStartDate(date);
        handleResistanceChange({
            target: { name: "date", value: date }
        })
    }

    const handleResistanceChange = (event) => {
        const { name, value } = event.target;
        resistanceForm({ ...resistanceForm, [name]: value })

    }

    const validateForm = (form) => {
        return form.name && form.weight && form.sets && form.reps && form.date;
    }

    const handleResistanceSubmit = async (event) => {
        event.preventDefault();

        //get token
        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return false;

        // get user id 
        const userId = Auth.getUserId();

        // resistance submit
        if (validateForm(resistanceForm)) {
            try {
                // add userid to resistance form
                resistanceForm.userId = userId;

                const response = await createResistance(resistanceForm, token);

                if (!response.ok) {
                    throw new Error('something went wrong!');
                }

                setMessage("Resistance successfully created!")
                setTimeout(() => {
                    setMessage("")
                }, 3000);

            } catch (err) {
                console.error(err)
            }
        }

        // clear form input
        resistanceForm({
             name: "",
        distance: "",
        time: "",
        date: ""

        });
    }

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='resistance'>
            <Header />
            <div className="d-flex flex-column align-items-center">
                <h2 className='title text-center'>Add Track Exercise</h2>
                <form className='resistance-form d-flex flex-column' onSubmit={handleResistanceSubmit}>
                    <div className='d-flex justify-content-center'><img alt="resistance" src={resistanceIcon} className="exercise-form-icon" /></div>
                    <label>Name:</label>
                    <input type="text" name="name" id="name" placeholder="Bench Press"
                        value={resistanceForm.name} onChange={handleResistanceChange} />
                    <label>Distance (KM):</label>
                    <input type="number" name="weight" id="weight" placeholder="0"
                        value={resistanceForm.weight} onChange={handleResistanceChange} />
                    <label>Time</label>
                    <input type="number" name="sets" id="sets" placeholder="0"
                        value={resistanceForm.sets} onChange={handleResistanceChange} />
                   
                   <label >Date:</label>
                    <DatePicker selected={startDate} value={resistanceForm.date} onChange={handleDateChange} placeholderText="mm/dd/yyyy" />
                    <button className='submit-btn' type="submit" disabled={!validateForm(resistanceForm)} >Add</button>
                </form>
                <p className='message'>{message}</p>
            </div>
        </div>
    )
}
