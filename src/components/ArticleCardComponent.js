import { Link, useParams } from "react-router-dom";
import {FaEye, FaRegThumbsDown, FaRegThumbsUp, FaUser, FaAngleLeft, FaAngleRight} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/constants";

const ArticleCardComponent = ({sortBy}) => {
    const { categoryId } = useParams();
    const [articles, setArticles] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const [totalArticles, setTotalArticles] = useState(5);
    const [pages, setPages] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        getArticlesByCategory(categoryId);
    }, [categoryId, sortBy, currPage]);

    useEffect(() => {
        getArticlesCount(categoryId);
    }, [categoryId]);

    async function getArticlesCount(categoryId) {
        const response = await axios({
            method: 'GET',
            url: `${BACKEND_BASE_URL}/article/count?categoryId=${categoryId}`
        });
        setTotalArticles(response?.data?.data?.count);
        let temp = [];
        for(let currPage = 1; currPage <= Math.ceil(response?.data?.data?.count / itemsPerPage); currPage++){
            temp.push(currPage);
        };
        setPages(temp);
    }

    function setCurrentPage(pageNo) {
        setCurrPage(Number(pageNo));
    }

    async function getArticlesByCategory(categoryId) {
        if(Number(categoryId) === 1) {
            getTrendingArticles();
        }
        else {
            if(sortBy === "votes") {
                const response = await axios({
                    method: "GET",
                    url: `${BACKEND_BASE_URL}/articles/${categoryId}/mostVotes`
                });
                setArticles(response?.data?.data);
            }
            else if(sortBy === "date") {
                const response = await axios({
                    method: "GET",
                    url: `${BACKEND_BASE_URL}/article?categoryId=${categoryId}&page=${currPage}&itemsPerPage=${itemsPerPage}`
                });
                setArticles(response?.data?.data);
            }
            else {
                const response = await axios({
                    method: "GET",
                    url: `${BACKEND_BASE_URL}/article?categoryId=${categoryId}&page=${currPage}&itemsPerPage=${itemsPerPage}`
                });
                setArticles(response?.data?.data);   
            }
        }
    }

    async function getTrendingArticles() {
        const response = await axios({
            method: 'GET',
            url: `${BACKEND_BASE_URL}/articles/trending?mostVotes=${sortBy === "votes"}&page=${currPage}&itemsPerPage=${itemsPerPage}`
        });
        setArticles(response?.data?.data);
    }

    return (
        <>
        {
            articles.map((article) => {
                return (
                    <div className = "mx-5 px-2 py-4 bg-white flex justify-between items-center" key = {article?.id}>
                        <div className = "flex items-center">
                            <div className = "bg-slate-400 rounded-full p-2 mx-5 text-gray-100 items-center flex justify-center">
                                <FaUser size = {25}/>
                            </div>
                            <div className = "">
                                <Link to = {`/article/${article.id}`}><h2 className = "text-lg font-normal">{article.title}</h2></Link>
                                <h3 className = "font-thin text-sm text-gray-400">Authored by <span className = "text-gray-400 font-normal \
                                hover:underline hover:cursor-pointer"><Link to = {`/profile/${article?.authorId}`}>{article.User.userName}</Link></span></h3>
                            </div>
                        </div>
                        <div className = "justify-around items-center grid grid-cols-4">
                            <div className = "col-span-1 mx-2 text-green-400 flex items-center">
                                <FaRegThumbsUp size={20} />
                                <h2 className = "mx-2">{article.upvotes}</h2>
                            </div>
                            <div className = " col-span-1 mx-2 text-red-400 flex items-center">
                                <FaRegThumbsDown size = {20}/>
                                <h2 className = "mx-2">{article.downvotes}</h2>
                            </div>
                            <div className = "col-span-2 mx-5 flex items-center text-gray-400">
                                <FaEye size = {20}/>
                                <h2 className = "mx-2">{article.views}</h2>
                            </div>
                        </div>
                    </div>
                );
            })
        }
        <div className = "mx-5 bg-gray-100 py-2 rounded-sm flex justify-center">
            <div className = "px-2 py-2 text-gray-400 flex items-center hover:cursor-pointer \
            hover:text-indigo-400" key = {-1} onClick = {() => {
                setPageIndex(Math.max(0, pageIndex - 1));
            }}>
                <FaAngleLeft size = {23}/>
            </div>
            {
                pages.slice(pageIndex, Math.min(pageIndex + 2, totalArticles)).map((ele) => {
                    return (
                        <div className = {`font-normal px-4 py-2 rounded-md inline-block hover:bg-indigo-400
                        hover:cursor-pointer relative hover:text-white text-gray-400
                        ${(currPage === ele) ? "text-indigo-400" : ""}`} key = {ele} 
                        onClick = {() => {
                            setCurrentPage(ele);
                        }}>
                            <h2 className = {`before:content-['.'] inline-block before:absolute
                            before:bottom-0 before:font-bold before:text-3xl
                            ${(currPage === ele) ? "before:text-indigo-400" : "before:text-transparent"}`}>{ele}</h2>
                        </div>
                    );
                })
            }
            <div className = "px-2 py-2 text-gray-400 flex items-center hover:cursor-pointer \
            hover:text-indigo-400" key = {-2} onClick = {() => {
                setPageIndex(Math.min(pageIndex + 1, Math.ceil(totalArticles / itemsPerPage) - 1));
            }}>
                <FaAngleRight size = {23}/>
            </div>
        </div>
        </>
    );
}

export default ArticleCardComponent;
