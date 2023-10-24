import { useContext } from "react";
import {FaEdit, FaEnvelope, FaUser} from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const HeaderComponent = () => {
    const [user] = useContext(UserContext);
    // console.log(user);
    return (
        <div className = "flex justify-between p-4 text-indigo-400 font-semibold">
            <Link to = "/"><h1 className = "font-bold">PrepX</h1></Link>
            <ul className = "flex justify-around">
                <Link to = {`/discuss/1`}><li className = "mx-5 flex items-center">Discuss<FaEnvelope size = {16} className = "mx-1"/></li></Link>
                <Link to = "/write"><li className = "mx-5 flex items-center">Write<FaEdit size = {16} className = "mx-1"/></li></Link>
                <Link to = {`/profile/${user?.id}`}><li className = "ml-5 flex items-center">Profile<FaUser size = {16} className = "mx-1"/></li></Link>
            </ul>
        </div>
    );
}

export default HeaderComponent;