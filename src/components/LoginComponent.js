import loginImage from "../assets/images/login-img.jpg";
import { Link } from "react-router-dom";
import axios from "axios";

const LoginComponent = (props) => {

    const submitHandler = async (event) => {
        try{
            event.preventDefault();
            const formObj = event.target;
            const response = await axios({
                method: 'GET',
                url: `http://localhost:8080/api/login?userName=${formObj.username.value}&password=${formObj.password.value}`, 
            });
            console.log(response);
            if(response?.data?.data.valid){
                props.setIsAuthenticated(true);
                props.setUser(response.data.data);
            }
            else {
                alert("Wrong Credentials");
            }
        }
        catch(err) {
            console.log("Something went wrong in the ui");
            throw err;
        }
    }

    return (
        <div className = "h-screen w-screen flex items-center justify-center">
            <div className = "shadow-lg w-3/5 h-2/3 flex justify-around bg-white drop-shadow-md">
                <div className = "flex items-center">
                    <img src = {loginImage} alt = "LoginImage.jpg" className = "w-full h-4/5 bg-blend-screen"/>
                </div>
                <div>
                    <form onSubmit = {submitHandler}>
                        <div className = "font-bold text-3xl flex justify-center py-5 text-emerald-600">
                            <h2>Sign In</h2>
                        </div>
                        <div className = "flex justify-center py-4">
                            <label className = "w-[100px] py-1 bg-emerald-600 bg-opacity-70 rounded-sm flex justify-center text-white font-semibold" 
                            htmlFor = "username">Username</label>
                            <input type = 'text' id = 'username' className = "w-40 text-emerald-600 rounded-sm px-3 py-[2px] \
                            font-normal focus:outline-emerald-600 focus:outline-1 border-emerald-600 border"/>
                        </div>
                        <div className = "flex justify-center py-4">
                            <label className = "w-[100px] py-1 bg-emerald-600 bg-opacity-70 rounded-sm flex justify-center text-white font-semibold" htmlFor = "password">Password</label>
                            <input type = 'password' id = 'password' className = "w-40 text-emerald-600 rounded-sm px-3 py-[2px] font-normal focus:outline-emerald-600 focus:outline-1 \
                            border border-emerald-600"/>
                        </div>
                        <div className = "flex justify-center py-4">
                            <button type = "submit" className = "border bg-emerald-600 px-5 py-2 bg-opacity-70 rounded-md hover:bg-transparent hover:border-emerald-600 \
                            hover:text-emerald-600 text-white font-semibold">Sign In</button>
                        </div>
                        <div className = "flex justify-center py-4">
                            <p>Not an user? <Link to = "/register"><span className = "text-emerald-800 hover:underline font-semibold">Register</span></Link></p>
                        </div> 
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;