import { useContext, useEffect, useState } from "react";
import { FaAngleLeft, FaBook, FaEye, FaStar, FaUser } from "react-icons/fa";
import { UserContext } from "../App";
import { BACKEND_BASE_URL } from "../utils/constants";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const UserProfileComponent = () => {
    const [user, setUser] = useContext(UserContext);
    const [userProfile, setUserProfile] = useState(null);
    const { id } = useParams();
    const [articles, setArticles] = useState([]);
    const [shouldEditProfile, setShouldEditProfile] = useState(false);
    const [userDetails, setUserDetails] = useState({
        userName: user?.userName,
        email: user?.email,
        password: user?.password, 
    });
    const [editIndex, setEditIndex] = useState(0);
    const [followings, setFollowings] = useState([]);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        getUserDetails();
        getAllPosts();
        getAllFollowings();
    }, [id]);

    async function getUserDetails() {
        const response = await axios({
            method: 'GET',
            url: `${BACKEND_BASE_URL}/user/${id}`
        });
        setUserProfile(response?.data?.data);
    }

    async function getAllPosts() {
        const response = await axios({
            method: 'GET',
            url: `${BACKEND_BASE_URL}/user/${id}/articles`
        });
        setArticles(response?.data?.data);
    }

    async function getAllFollowings() {
        const response = await axios({
            method: 'GET',
            url: `${BACKEND_BASE_URL}/user/following/${id}`
        });
        setFollowings(response?.data?.data);
    }

    async function saveHandler() {
        await axios({
            method: 'PATCH',
            url: `${BACKEND_BASE_URL}/user/${user?.id}`,
            data: userDetails
        });

        if(profileImage) {
            const response = await axios({
                method: 'POST',
                url: `${BACKEND_BASE_URL}/user/profile/image`,
                data: {
                    image: profileImage
                }
            });
            const profileImageUrl = response?.data?.data?.url;
            await axios({
                method: 'PATCH',
                url: `${BACKEND_BASE_URL}/user/${user?.id}`,
                data: {
                    imageUrl: profileImageUrl
                }
            });
        }
    }

    async function setDetails(event) {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value
        });
    }

    async function profileChangeHandler(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setProfileImage(reader.result);
        }
    }

    // This function is to update followings and followers
    async function followHandler(isFollowing) {
        if(isFollowing) {
            let arr = user?.following.split(";");
            let indx = arr.indexOf(id);
            arr.splice(indx, 1);
            let following = arr.join(";");
            await axios({
                method: 'PATCH',
                url: `${BACKEND_BASE_URL}/user/${user?.id}`,
                data: {
                    following: following
                }
            });

            setTimeout(async () => {
                const res = await axios({
                method: 'GET',
                url: `${BACKEND_BASE_URL}/user/${user?.id}`
                });
                setUser(res?.data?.data);
            }, 100);

            const response = await axios({
                method: 'GET',
                url: `${BACKEND_BASE_URL}/user/${id}`
            });
            let arr1 = response?.data?.data.followers.split(";");
            let indx1 = arr1.indexOf(user?.id);
            arr1.splice(indx1, 1);
            let followers1 = arr1.join(";");
            await axios({
                method: 'PATCH',
                url: `${BACKEND_BASE_URL}/user/${id}`,
                data: {
                    followers: followers1
                }
            })
        }
        else {
            let arr = user?.following.split(";");
            arr.push(id);
            let following = arr.join(";");
            const res1 = await axios({
                method: 'PATCH',
                url: `${BACKEND_BASE_URL}/user/${user?.id}`,
                data: {
                    following: following
                }
            });

            setTimeout(async () => {
                const res = await axios({
                method: 'GET',
                url: `${BACKEND_BASE_URL}/user/${user?.id}`
                });
                console.log(res?.data?.data);
                setUser(res?.data?.data);
            }, 100);

            const response = await axios({
                method: 'GET',
                url: `${BACKEND_BASE_URL}/user/${id}`
            });
            let arr1 = response?.data?.data.followers.split(";");
            arr1.push(String(user?.id));
            let followers1 = arr1.join(";");
            await axios({
                method: 'PATCH',
                url: `${BACKEND_BASE_URL}/user/${id}`,
                data: {
                    followers: followers1
                }
            });   
        };
        setTimeout(() => {
            getUserDetails();
        }, 100);
    }

    if(userProfile === null) {
        return (
            <>
                loading
            </>
        );
    }

    return (
        <div className = "grid grid-cols-8 grid-rows-6 bg-gray-200 min-h-screen max-h-fit">
            <div className = "lg:col-span-2 col-span-8 row-span-2 lg:row-span-6">
                <div className = "shadow-md bg-white mx-5 my-10 flex items-center hover:drop-shadow-md rounded-sm">
                    <div className = "w-full bg-gray-100 rounded-sm">
                        <div className = "bg-gray-100 px-5 py-3 rounded-sm">
                            <div className = "rounded-full bg-gray-400 inline-block text-white">
                                {/* <FaUser size = {30}/> */}
                                <img src = {"http://res.cloudinary.com/dpnxhwpcq/image/upload/v1693399030/xpd0og0ce1mcnwmjk2nu.jpg"} className = "w-12 h-12 rounded-full"/>
                            </div>
                            <div className = "flex items-center">
                                <h2 className = "font-medium text-gray-600 mr-1">{userProfile?.userName}</h2>
                                <h3 className = "text-gray-400 text-sm font-light mx-1">{((userProfile.followers.split(";").length) - 1)} followers</h3>
                            </div>
                            <h2 className = "font-light text-gray-600">{userProfile?.email}</h2>
                            {
                                (Number(user?.id) === Number(id)) ?
                                <button className = {`text-sm my-1 p-1 text-white rounded-md border 
                                ${shouldEditProfile ? "bg-gray-400" : "bg-indigo-400 hover:bg-transparent hover:text-indigo-400 border-indigo-400"}`} disabled = {shouldEditProfile} 
                                onClick = {() => {
                                    setShouldEditProfile(true);
                                }}>Edit Profile</button> :
                                <button className = {`text-sm my-1 p-1 text-white rounded-md border 
                                ${shouldEditProfile ? "bg-gray-400" : "bg-indigo-400 hover:bg-transparent hover:text-indigo-400 border-indigo-400"}`} disabled = {shouldEditProfile} 
                                onClick = {() => {
                                    followHandler(user?.following.includes(id));
                                }}>{user?.following.includes(id) ? "Following" : "Follow"}</button>

                            }
                        </div>
                        <div className = "border-t py-3 p-5 rounded-t-3xl bg-white rounded-sm">
                            <h1 className = "text-indigo-400 font-medium my-1">Community Stats</h1>
                            <div className = "flex justify-between">
                                <div className = "flex items-center">
                                    <FaStar className = "text-gray-400" size = {15}/>
                                    <h2 className = "font-light text-gray-400 mx-2">Reputation</h2>
                                </div>
                                <h2 className = "font-semibold text-gray-400">{articles.reduce((a, b) => a + b.upvotes - b.downvotes, 0)}</h2>
                            </div>
                            <div className = "flex justify-between">
                                <div className = "flex items-center">
                                    <FaEye className = "text-gray-400" size = {15}/>
                                    <h2 className = "font-light text-gray-400 mx-2">Views</h2>
                                </div>
                                <h2 className = "font-semibold text-gray-400">{articles.reduce((a, b) => a + b.views, 0)}</h2>
                            </div>
                            <div className = "flex justify-between">
                                <div className = "flex items-center">
                                    <FaBook className = "text-gray-400" size = {15}/>
                                    <h2 className = "font-light text-gray-400 mx-2">Posts</h2>
                                </div>
                                <h2 className = "font-semibold text-gray-400">{articles?.length}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className = " bg-gray-100 mx-5 mt-10 flex items-center shadow-md rounded-sm">
                    <div className = "px-5 py-3 rounded-sm">
                        <h2 className = "text-indigo-400 font-semibold">Following({followings.length})</h2>
                    </div>
                </div>
                <div className = "overflow-y-scroll h-32 bg-white mx-5 mb-10 text-gray-600 rounded-sm shadow-md hover:drop-shadow-md">
                {
                    followings?.map((following) => {
                        return (
                            <div className = "px-5 mr-0 bg-white flex items-center py-2" key = {following?.id}>
                                <div className = "rounded-full bg-gray-400 p-1 text-white">
                                    <FaUser size = {18}/>
                                </div>
                                <Link to = {`/profile/${following?.id}`}>
                                    <h2 className = "mx-1 text-gray-400">{following?.userName}</h2>
                                </Link>
                            </div>
                        );
                    })
                }
                </div>
            </div>
            {
                !shouldEditProfile &&
                <div className = "lg:col-span-6 col-span-8 row-span-4 lg:row-span-6 bg-white mx-5 my-10 \
                shadow-md hover:drop-shadow-md rounded-sm h-screen">
                    <div className = "bg-gray-100 px-5 py-3">
                        <h2 className = "font-semibold text-gray-600 text-lg">All Posts</h2>
                    </div>
                    <div className = "overflow-y-scroll max-h-full">
                    {
                        articles?.map((article) => {
                            return (
                                <div key = {article?.id} className = "bg-white p-5 border-b">
                                    <div className = "font-light text-gray-600 text-sm flex justify-between">
                                        <h2>{Math.floor(((new Date(Date.now()).getTime())  - (new Date(article?.createdAt)).getTime()) / (1000 * 60 * 60 * 24))} days ago</h2>
                                        <h2>{article?.views} Views</h2>
                                    </div>
                                    <Link to = {`/article/${article?.id}`}>
                                        <h2 className = "font-semibold">{article?.title}</h2>
                                        {/* {article?.content} */}
                                        <div className = "font-light text-gray-600" dangerouslySetInnerHTML = {{__html: article?.content.slice(0, 150) + "..."}}></div>
                                    </Link>
                                </div>
                            );
                        })
                    }
                    </div>
                </div>
            }
            {
                shouldEditProfile &&
                <div className = "lg:col-span-6 col-span-8 row-span-4 lg:row-span-6 bg-white mx-5 my-10 \
                shadow-md hover:drop-shadow-md rounded-sm">
                    <div className = "bg-gray-100 px-2 py-3">
                        <div className = "flex">
                            <div className = "flex items-center text-slate-600 hover:cursor-pointer border-r border-r-gray-400 px-2"
                            onClick = {() => {
                                setShouldEditProfile(false);
                            }}>
                                <FaAngleLeft/>
                                <h2>Back</h2>
                            </div>
                            <h2 className = "font-semibold text-gray-600 text-lg mx-2">Personal Information</h2>
                        </div>
                    </div>
                    <div className = "bg-white">
                    <div className = "grid grid-cols-12 m-5">
                            <h2 className = "mr-3 text-indigo-400 font-semibold col-span-3">Edit Profile Picture</h2>
                            <div className = "col-span-9 flex w-full justify-center">
                                <input type = "file" className = "bg-transparent \
                                outline-none text-gray-600 font-normal text-sm w-4/5"
                                onChange = {profileChangeHandler}/>
                            </div>
                        </div>
                        <div className = "grid grid-cols-12 m-5">
                            <h2 className = "mr-3 text-indigo-400 font-semibold col-span-3">Username</h2>
                            <div className = "col-span-9 flex w-full justify-center">
                                <input type = "text" className = "bg-transparent border-b border-b-gray-400 w-3/4 \
                                outline-none text-gray-600 font-normal" value = {userDetails.userName}
                                onChange = {setDetails} name = "userName" disabled = {(editIndex !== 1)}/>
                                <h2 className = {`${(editIndex === 1) ? "text-gray-400" : "text-indigo-400"} hover:underline hover:cursor-pointer`}  
                                onClick = {() => {
                                    setEditIndex(1);
                                }}>Edit</h2>
                            </div>
                        </div>
                        <div className = "grid grid-cols-12 m-5">
                            <h2 className = "mr-3 text-indigo-400 font-semibold col-span-3">E-Mail</h2>
                            <div className = "col-span-9 flex justify-center">
                                <input type = "email" className = "bg-transparent border-b border-b-gray-400 w-3/4 \
                                outline-none text-gray-600 font-normal" value = {userDetails?.email} disabled = {(editIndex !== 2)}
                                onChange = {setDetails} name = "email"/>
                                <h2 className = {`${(editIndex === 2) ? "text-gray-400" : "text-indigo-400"} hover:underline hover:cursor-pointer`} 
                                onClick = {() => {
                                    setEditIndex(2);
                                }}>Edit</h2>
                            </div>
                        </div>
                        <div className = "grid grid-cols-12 m-5">
                            <h2 className = "mr-3 text-indigo-400 font-semibold col-span-3">Password</h2>
                            <div className = "col-span-9 flex justify-center">
                                <input type = "password" className = "bg-transparent border-b border-b-gray-400 w-3/4 \
                                outline-none text-gray-600 font-normal" value = {userDetails?.password} disabled = {(editIndex !== 3)}
                                onChange = {setDetails} name = "password"/>
                                <h2 className = {`${(editIndex === 3) ? "text-gray-400" : "text-indigo-400"} hover:underline hover:cursor-pointer`} 
                                onClick = {() => {
                                    setEditIndex(3);
                                }}>Edit</h2>
                            </div>
                        </div>
                        <div className = "grid grid-cols-12 m-5">
                            <h2 className = "mr-3 text-indigo-400 font-semibold col-span-3">About</h2>
                            <div className = "col-span-9 flex justify-center">
                                <input type = "text" className = "bg-transparent border-b border-b-gray-400 w-3/4 \
                                outline-none text-gray-600 font-normal" value = {userDetails?.email}
                                onChange = {setDetails} name = "about" disabled = {(editIndex !== 4)}/>
                                <h2 className = {`${(editIndex === 4) ? "text-gray-400" : "text-indigo-400"} hover:underline hover:cursor-pointer`} 
                                onClick = {() => {
                                    setEditIndex(4);
                                }}>Edit</h2>
                            </div>
                        </div>
                        <div className = "flex justify-center">
                            <button className = "bg-indigo-300 px-2 py-1 rounded-md text-white font-semibold \
                            border border-indigo-300 hover:bg-transparent hover:text-indigo-300" onClick = {saveHandler}>
                            Save</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default UserProfileComponent;
