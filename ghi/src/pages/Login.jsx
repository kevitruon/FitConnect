import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useToken, { useAuthContext } from '@galvanize-inc/jwtdown-for-react'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const { login } = useToken()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const success = await login(username, password)
            console.log('Login success:', success)
            if (success) {
                navigate('/')
            } else {
                setErrorMessage('Invalid username or password')
            }
        } catch (error) {
            console.error('Login error:', error)
            setErrorMessage('An error occurred during login')
        }
    }

    return (
        <div>
            <h2>Login</h2>
            {errorMessage && <p>{errorMessage}</p>}
            <form onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login
