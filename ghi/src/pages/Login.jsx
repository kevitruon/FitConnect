import React from 'react'

function Login() {
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

        const response = await fetch(url, fetchConfig)

        if (response.ok) {
            setFormData({
                username: '',
                password: '',
            })
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
                <form>
                    <h1>Sign in to your Account</h1>
                    <span></span>
                    <input type="username" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <a href="#">Forgot your password?</a>
                    <button>Sign In</button>
                </form>
            </div>
        </div>
    )
}

export default Login
