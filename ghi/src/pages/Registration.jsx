import { useState } from 'react'
import useToken from '@galvanize-inc/jwtdown-for-react'
import { useNavigate } from 'react-router-dom'

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    })

    const { login } = useToken()
    const nav = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const createUrl = 'http://localhost:8000/users'

        const fetchConfig = {
            method: 'post',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const response = await fetch(createUrl, fetchConfig)

        if (response.ok) {
            setFormData({
                username: '',
                email: '',
                password: '',
            })
            login(formData.username, formData.password)
            nav('/')
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
        <div>
            <h1>New User</h1>
            <form onSubmit={handleSubmit} id="create-user-form">
                <div>
                    <input
                        onChange={handleFormChange}
                        value={formData.username}
                        placeholder="Username"
                        required
                        type="text"
                        id="username"
                        name="username"
                        className="form-control"
                        autoFocus
                    />{' '}
                    <label htmlFor="username">Username</label>
                </div>
                <div>
                    <input
                        onChange={handleFormChange}
                        value={formData.email}
                        placeholder="Email"
                        required
                        type="text"
                        name="email"
                        id="email"
                        className="form-control"
                    />{' '}
                    <label htmlFor="email">Email</label>
                </div>
                <div>
                    <input
                        onChange={handleFormChange}
                        value={formData.password}
                        placeholder="Password"
                        required
                        type="text"
                        name="password"
                        id="password"
                        className="form-control"
                    />{' '}
                    <label htmlFor="password">Password</label>
                </div>
                <button>Create</button>
            </form>
        </div>
    )
}

export default Register
