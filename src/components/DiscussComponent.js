import { useEffect, useState } from "react";
import CategoryCardComponent from "./CategoryCardComponent";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/constants";
import ArticleCardComponent from "./ArticleCardComponent";

const DiscussComponent = () => {
    const [categories, setCategories] = useState([]);
    const [sortBy, setSortBy] = useState("");
    
    useEffect(() => {
        getCategories();
    }, []);


    async function getCategories() {
        const response = await axios({
            method: "GET",
            url: `${BACKEND_BASE_URL}/categories`
        });
        setCategories(response?.data?.data)
    }

    return (
        <div className = "bg-gray-200 h-screen w-full">
            <div>
                {
                    categories.map((category) => {
                        return <CategoryCardComponent key = {category.id} categoryName = {category.name} catId = {category.id}
                        />
                    })
                }
            </div>
            <div className = "mx-5 mt-5 px-2 py-3 bg-gray-100 shadow-sm drop-shadow-sm">
                <div className = "flex justify-between">
                    <ul className = "flex font-light text-base text-gray-400">
                        <li className = "mx-5 hover:cursor-pointer hover:text-gray-800"
                        onClick = {() => {
                            setSortBy("votes");
                        }}>Most Votes</li>
                        <li className = "mx-5 hover:cursor-pointer hover:text-gray-800"
                        onClick = {() => {
                            setSortBy("date");
                        }}>Newest to Oldest</li>
                    </ul>
                    <input type = "text" placeholder = "Search.." className = "border px-1 rounded-sm"/>
                </div>
            </div>
            <ArticleCardComponent sortBy = {sortBy}/>
        </div>
    );
}

export default DiscussComponent;