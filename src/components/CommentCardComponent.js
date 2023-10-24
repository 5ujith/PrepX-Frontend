import { FaAngleUp, FaCaretDown, FaCaretUp, FaReply, FaUser } from "react-icons/fa";
import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/constants";

const CommentCardComponent = ({content, authorId, votes, likedBy, dislikedBy}) => {
    const [user] = useContext(UserContext);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(async () => {
        const response = await axios({
            method: 'GET',
            url: `${BACKEND_BASE_URL}/user/${authorId}`
        });
        setUserDetails(response?.data?.data);
    }, []);

    async function likeHandler() {
        if(dislikedBy.includes(user?.id)) {
            let dislikedByList = dislikedBy.split(";");
            let index = dislikedByList.indexOf(user?.id);
            dislikedByList.splice(index, 1);
            await 
        }
    }

    return (
        <div className = "px-5 py-2">
            <div className = "flex items-center">
                <div className = "bg-slate-300 rounded-full p-1 text-gray-50">
                    <FaUser />
                </div>
                <h2 className = "mx-1 text-gray-400 font-base text-sm">{user?.userName}</h2>
            </div>
            <div className = "mx-6 text-gray-700">
                <p>{content}</p>
            </div>
            <div className = "flex text-gray-400 items-center mx-5 my-1">
                <div className = "flex">
                    <FaCaretUp size = {18} className = "hover:cursor-pointer"/>
                    <h2 className = "mx-1 text-sm">{votes}</h2>
                    <FaCaretDown size = {18} className = "hover:cursor-pointer"/>
                </div>
                <div className = "flex items-center mx-2 text-sm">
                    <h2 className = "mx-1">Reply</h2>
                    <FaReply size = {15}/>
                </div>
            </div>
        </div>
    );
}

export default CommentCardComponent;