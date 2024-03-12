import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const { logout } = useToken();
    const nav = useNavigate();

    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            await logout();
            nav("/");
        } catch (error) {
            console.error("Unable to logout: ", str(error));
        }
    };

    return (
        <button onClick={handleSignOut}>Sign Out</button>
    )
};

export default Logout;