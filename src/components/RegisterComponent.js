import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import RegisterImg from "../assets/images/register-img.jpg";

const RegisterComponent = () => {
    const navigate = useNavigate();
    const submitHandler = async (event) => {
        try {
            event.preventDefault();
            const formObj = event.target; 
            const response = await axios({
                method: 'POST',
                url: "http://localhost:8080/api/register", 
                data: {
                    userName: formObj.username.value, 
                    password: formObj.password.value, 
                    email: formObj.email.value,
                }
            });
            console.log(response);
            alert("User Created Successfully");
            navigate('/');
        }
        catch(error) {
            console.log("Something went wrong in ui");
            throw error
        }
    }

    return (
        <div className = "h-screen w-screen flex items-center justify-center">
            <div className = "h-2/3 w-1/2 flex justify-center items-center shadow-lg  p-5">
                <div className = "h-full w-full bg-opacity-40 backdrop-blur-lg flex justify-center items-center text-indigo-500 font-semibold">
                    <form onSubmit = { submitHandler }>
                        <div className = "font-bold text-3xl flex justify-center py-5">
                            <h2>Sign Up</h2>
                        </div>
                        <div className = "flex justify-center py-4">
                            <label className = "w-[100px] py-1 bg-indigo-500 bg-opacity-20 rounded-sm flex justify-center" htmlFor = "username">Username</label>
                            <input type = 'text' id = 'username' className = "w-40 text-indigo-500 rounded-sm px-3 py-[2px] font-normal focus:outline-indigo-500 focus:outline-1 \
                            border border-indigo-500"/>
                        </div>
                        <div className = "flex justify-center py-4">
                            <label className = "w-[100px] py-1 bg-indigo-500 bg-opacity-20 rounded-sm flex justify-center" htmlFor = "email">Email</label>
                            <input type = 'email' id = 'email' className = "w-40 text-indigo-500 rounded-sm px-3 py-[2px] font-normal focus:outline-indigo-500 focus:outline-1 \
                            border border-indigo-500"/>
                        </div>
                        <div className = "flex justify-center py-4">
                            <label className = "w-[100px] py-1 bg-indigo-500 bg-opacity-20 rounded-sm flex justify-center" htmlFor = "password">Password</label>
                            <input type = 'password' id = 'password' className = "w-40 text-indigo-500 rounded-sm px-3 py-[2px] font-normal focus:outline-indigo-500 focus:outline-1 \
                            border border-indigo-500"/>
                        </div>
                        <div className = "flex justify-center py-4">
                            <button type = "submit" className = "border bg-indigo-600 px-5 py-2 bg-opacity-20 rounded-md hover:bg-transparent hover:border-indigo-500">Sign Up</button>
                        </div> 
                        <div className = "flex justify-center mb-4 font-normal">
                            <p>Already an user? <Link to = "/"><span className = "text-indigo-500 hover:underline font-semibold">Log In</span></Link></p>
                        </div> 
                    </form>
                </div>
                <div className = "h-full w-1/2 flex items-center">
                    <img src = {RegisterImg} alt = "register-img.jpg" className = "h-2/3 w-full"/>
                </div>
            </div>
        </div>
    );
}

export default RegisterComponent;