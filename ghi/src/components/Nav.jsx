import React from 'react'
import { NavLink } from 'react-router-dom'

function Nav() {
  return (
    <nav>
        <div>
            <li><NavLink className="nav-item" to="/">Home</NavLink></li>
            <li><NavLink className="nav-item" to="/login">Login</NavLink></li>
            <li><NavLink className="nav-item" to="/register">Register</NavLink></li>
            <li><NavLink className="nav-item" to="/">Home</NavLink></li>
            <li><NavLink className="nav-item" to="/">Home</NavLink></li>
            <li><NavLink className="nav-item" to="/">Home</NavLink></li>
            <li><NavLink className="nav-item" to="/">Home</NavLink></li>
            <li><NavLink className="nav-item" to="/">Home</NavLink></li>
            <li><NavLink className="nav-item" to="/">Home</NavLink></li>
            <li><NavLink className="nav-item" to="/">Home</NavLink></li>
        </div>
    <nav/>
  )
}

export default Nav
