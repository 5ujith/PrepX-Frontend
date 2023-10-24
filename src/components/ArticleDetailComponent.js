import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FaAngleLeft, FaRegComments, FaThumbsDown, FaThumbsUp, FaUser } from "react-icons/fa";
import { BACKEND_BASE_URL } from "../utils/constants";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentCardComponent from "./CommentCardComponent";
import { UserContext } from "../App";

const ArticleDetailComponent = ({title}) => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();
    const [user] = useContext(UserContext);

    useEffect(() => {
        getArticle(id);
        getComments(id);
        updateViews(id);
    }, []);

    async function updateViews(articleId) {
        const response = await axios({
            method: 'GET',
            url: `${BACKEND_BASE_URL}/article/${articleId}`
        });
        await axios({
            method: 'PATCH',
            url: `${BACKEND_BASE_URL}/article/${articleId}`,
            data: {
                views: response?.data?.data?.views + 1
            }
        });
    }

    async function getArticle(articleId) {
        const response = await axios({
            method: 'GET',
            url: `${BACKEND_BASE_URL}/article/${articleId}`
        });
        setArticle(response?.data?.data);
    }

    async function getComments(articleId) {
        const response = await axios({
            method: 'GET',
            url: `${BACKEND_BASE_URL}/article/${articleId}/comments`
        });
        setComments(response?.data?.data);
    }

    async function addComment(event) {
        event.preventDefault();
        const formObj = event?.target;
        const data = {
            articleId: id,
            content: formObj["comment-content"].value,
            authorId: user?.id,
            likedBy: "",
            dislikedBy: "",
            votes: 0
        };
        const response = await axios({
            method: 'POST',
            url: `${BACKEND_BASE_URL}/article/${id}/comment`,
            data: data
        });
        console.log(response);
    }

    function backButtonhandler() {
        navigate(-1);
    }

    async function likeHandler() {
        let likedUsers = [], dislikedUsers = [], downvotes = article?.downvotes;
        const tempLikedUsers = article?.likedBy.split(";");
        for(let user of tempLikedUsers) {
            if(user !== '') {
                likedUsers.push(Number(user));
            }
        }
        const tempDislikedUsers = article?.dislikedBy.split(";");
        for(let user of tempDislikedUsers) {
            if(user !== '') {
                dislikedUsers.push(Number(user));
            }
        }
        const userId = 1;
        if(dislikedUsers.includes(userId)) {
            const index = dislikedUsers.indexOf(userId);
            dislikedUsers.splice(index, 1);
            downvotes -= 1;
        }
        if(likedUsers.includes(userId)) {
            const index = likedUsers.indexOf(userId);
            likedUsers.splice(index, 1);
            const data = {
                likedBy: likedUsers.join(";"),
                dislikedBy: dislikedUsers.join(";"),
                upvotes: article?.upvotes - 1,
                downvotes: downvotes
            };
            await axios({
                method: 'PATCH',
                url: `${BACKEND_BASE_URL}/article/${id}`,
                data: data
            });
            getArticle(id);
        }
        else if(!likedUsers.includes(userId)) {
            likedUsers.push(userId);
            const data = {
                likedBy: likedUsers.join(";"),
                dislikedBy: dislikedUsers.join(";"),
                upvotes: article?.upvotes + 1,
                downvotes: downvotes
            };
            await axios({
                method: 'PATCH',
                url: `${BACKEND_BASE_URL}/article/${id}`,
                data: data
            });
            getArticle(id);
        }
    }

    async function dislikeHandler() {
        let likedUsers = [], dislikedUsers = [], upvotes = article?.upvotes;
        const tempLikedUsers = article?.likedBy.split(";");
        for(let user of tempLikedUsers) {
            if(user !== '') {
                likedUsers.push(Number(user));
            }
        }
        const tempDislikedUsers = article?.dislikedBy.split(";");
        for(let user of tempDislikedUsers) {
            if(user !== '') {
                dislikedUsers.push(Number(user));
            }
        }
        const userId = 1;
        if(likedUsers.includes(userId)) {
            const index = likedUsers.indexOf(userId);
            likedUsers.splice(index, 1);
            upvotes -= 1;
        }
        if(dislikedUsers.includes(userId)) {
            const index = dislikedUsers.indexOf(userId);
            dislikedUsers.splice(index, 1);
            const data = {
                likedBy: likedUsers.join(";"),
                dislikedBy: dislikedUsers.join(";"),
                downvotes: article?.downvotes - 1,
                upvotes: upvotes
            };
            await axios({
                method: 'PATCH',
                url: `${BACKEND_BASE_URL}/article/${id}`,
                data: data
            });
            getArticle(id);
        }
        else if(!dislikedUsers.includes(userId)) {
            dislikedUsers.push(userId);
            const data = {
                likedBy: likedUsers.join(";"),
                dislikedBy: dislikedUsers.join(";"),
                downvotes: article?.downvotes + 1,
                upvotes: upvotes
            };
            await axios({
                method: 'PATCH',
                url: `${BACKEND_BASE_URL}/article/${id}`,
                data: data
            });
            getArticle(id);
        }
    }

    return (
        <div className = "bg-gray-200 h-full p-5 min-h-screen">
            <div className = "bg-white pb-2">
                <div className = "p-3 px-5 flex border-b bg-gray-100">
                    <div className = "flex items-center text-slate-500 hover:cursor-pointer hover:text-gray-600"
                    onClick = {backButtonhandler}>
                        <FaAngleLeft size = {20}/>
                        <h2 className = "border-r border-gray-400 pr-3 text-sm">Back</h2>
                    </div>
                    <div className = "font-semibold pl-3">
                        <h2>{article?.title}</h2>
                    </div>
                </div>
                <div className = "flex border-b py-2">
                    <div className = "m-5">
                        <div className = {`pb-2 ${article?.likedBy.includes(String(1)) ? "text-green-400 hover:text-green-600" : "text-gray-400 hover:text-gray-600"} flex items-center`}>
                            <FaThumbsUp className = "hover:cursor-pointer" onClick = {likeHandler}/>
                            <h2 className = "px-2">{article?.upvotes}</h2>
                        </div>
                        <div className = {`pt-2 ${article?.dislikedBy.includes(String(1)) ? "text-red-400 hover:text-red-600" : "text-gray-400 hover:text-gray-600" } flex items-center`}>
                            <FaThumbsDown className = "hover:cursor-pointer" onClick = {dislikeHandler}/>
                            <h2 className = "px-2">{article?.downvotes}</h2>
                        </div>
                    </div>
                    <div className = "p-3 text-md font-normal text-gray-700">
                        <div className = "flex items-center mb-3">
                            <Link to = {`/profile/${article?.authorId}`}>
                                <div className = "hover:cursor-pointer flex items-center">
                                    <div className = "bg-slate-300 rounded-full p-1 text-gray-50">
                                        <FaUser />
                                    </div>
                                    <h2 className = "px-1 text-gray-400 font-base text-sm">{article?.User.userName}</h2>
                                </div>
                            </Link>
                            <h2 className = "px-1 text-gray-400 font-base text-sm border-l border-l-gray-300">Created at {new Date(article?.createdAt).toDateString()}</h2>
                        </div>
                        <div dangerouslySetInnerHTML = {
                            {__html:article?.content}
                        }></div>
                    </div>
                </div>
                <div className = "flex items-center p-3 px-5 text-gray-600 bg-gray-100">
                    <FaRegComments size={20} />
                    <h2 className = "mx-2 text-sm">Comments</h2>
                </div>
                <div className = "bg-white h-full m-5 border border-gray-400 rounded-sm ">
                    <form onSubmit = {addComment}>
                        <textarea placeholder = "Type your comment here.." className = "w-full p-2 outline-none \
                        border border-white border-b-gray-400 text-gray-700 hover:border-gray-700 active:border-gray-700 m-0 resize-none"
                        name = "comment-content"/>
                        <div className = "bg-white border-b m-0 p-0 flex justify-end">
                            <button className = "bg-emerald-400 px-2 py-1 text-white font-medium m-0"
                            type = "submit">Post</button>
                        </div>
                    </form>
                </div>
                <div>
                    {
                        comments.map((comment) => {
                            return <CommentCardComponent {...comment}/>
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default ArticleDetailComponent;