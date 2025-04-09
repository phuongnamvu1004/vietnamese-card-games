import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="breadcrumbs text-sm">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/signup">Sign Up</Link>
                </li>
            </ul>
        </div>
    )
}

export default Navbar