import useToken, { useAuthContext } from '@galvanize-inc/jwtdown-for-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useToken()
    const nav = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(`username: ${username} password: ${password}`)
        login(username, password)
            .then((response) => {
                console.log('Login successful', response)
                nav('/')
            })
            .catch((error) => {
                console.error('Login failed', error)
            })
        e.target.reset()
    }

    return (
        <div>
            <h5>Login</h5>
            <div>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
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
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password"
                            required
                            type="password"
                            name="password"
                            id="password"
                            className="form-control"
                        />{' '}
                        <label htmlFor="password">Password</label>
                    </div>
                    <button>Log In</button>
                </form>
            </div>
        </div>
    )
}

export default Login
