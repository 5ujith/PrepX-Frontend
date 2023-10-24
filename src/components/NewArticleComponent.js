import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../utils/constants";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserContext } from "../App";

const modules  = {
    toolbar: [
        [{header: [1, 2, 3, 4, 5, 6, false]}],
        [{ font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image", "video"],
    ],
}

const NewArticleComponent = () => {
    const [categories, setCategories] = useState([]);
    const [value, setValue] = useState("");
    const [categoryId, setCategoryId] = useState(0);
    const [user] = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [canPublish, setCanPublish] = useState("false");

    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(() => {
        console.log(value);
        if(title !== "" && value !== "" && categoryId !== 0) {
            setCanPublish("true");
        }
        else {
            setCanPublish("false");
        };
    }, [title, categoryId, value]);

    async function getAllCategories() {
        const response = await axios({
            method: 'GET',
            url: `${BACKEND_BASE_URL}/categories`
        });
        console.log(response?.data?.data);
        setCategories(response?.data?.data);
    }

    async function articleSubmitHandler() {
        const data = {
            title: title,
            upvotes: 0,
            downvotes: 0,
            views: 0,
            authorId: user?.id,
            likedBy: "",
            dislikedBy: "",
            content: value,
            categoryId: categoryId
        };
        console.log(data);
        const response = await axios({
            method: 'POST',
            url: `${BACKEND_BASE_URL}/article`,
            data: data
        });
        console.log(response);
    }

    return (
        <div className = "bg-gray-200 h-full w-full p-5 shadow-md drop-shadow-sm min-h-screen">
            <div className = "bg-white h-full rounded-sm p-5">
                <div className = "font-semibold text-lg mb-3 text-gray-600 flex justify-between">
                    <h2>What's on your mind ?</h2>
                    <button className = {`${(canPublish === "false") ? "bg-gray-400 border-gray-400" : "bg-indigo-400 border-indigo-400 hover:text-indigo-400 \
                    hover:bg-transparent"} px-2 py-1 rounded-md  border text-base text-white`}
                    onClick = {articleSubmitHandler} disabled = {(canPublish === "false")}>Publish</button>
                </div>
                <input type = "text" placeholder = "Enter Title.." className = "border w-full p-2 my-2 text-gray-600 text-base \
                placeholder:text-gray-600 placeholder:text-base" onChange = {(e) => {
                    setTitle(e?.target?.value);
                }}/>
                <select className = "w-full bg-gray-white border p-2 my-2 text-gray-600 text-base" onChange = {(e) => {
                    setCategoryId(e?.target?.value);
                }}>
                    <option key = {0} value = {0}>Add Category..</option>
                    {
                        categories.map((category) => {
                            return <option key = {category?.id} value = {category?.id}>{category?.name}</option>
                        })
                    }
                </select>
                <div className = "relative w-full py-2 text-gray-600">
                    <div className = "h-full w-full flex items-center justify-center">
                        <div className = "relative w-full flex items-center justify-center">
                            <ReactQuill theme = "snow" value = {value}
                            onChange = {setValue}
                            className = "w-full" 
                            modules = {modules}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default NewArticleComponent;