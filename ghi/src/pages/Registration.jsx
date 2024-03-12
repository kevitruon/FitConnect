import React, { useState } from 'react'

function Registration() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    })

    const handleSubmit = async (event) => {
        event.preventDefault()
        const url = 'http://localhost:8000/users'
        const fetchConfig = {
            method: 'post',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
            },
        }

        try {
            const response = await fetch(url, fetchConfig)
            if (response.ok) {
                // Registration successful
                console.log('Registration successful')
                setFormData({
                    username: '',
                    password: '',
                    email: '',
                })
            } else {
                // Registration failed
                console.error('Registration failed')
            }
        } catch (error) {
            console.error('Error occurred during registration:', error)
        }
    }

    const handleFormChange = (e) => {
        const value = e.target.value
        const inputName = e.target.name
        setFormData({
            ...formData,
            [inputName]: value,
        })
    }

    return (
        <div className="flex justify-center m-5" id="container">
            <div className="form-container sign-in-container">
                <form onSubmit={handleSubmit}>
                    <h1>Create an Account</h1>
                    <span></span>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleFormChange}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleFormChange}
                    />
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    )
}

export default Registration
