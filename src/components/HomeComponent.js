import { useNavigate } from "react-router-dom";

const HomeComponent = () => {
    const navigate = useNavigate();
    
    return (
        <div className = "h-screen w-full grid-cols-2 grid">
            <div className = "bg-blog-img bg-cover bg-center h-full items-center col-span-1">
            </div>
            <div className = "col-span-1 flex items-center justify-center text-5xl">
                <div>
                    <h1 className = "my-2 text-gray-600"><span className = "text-indigo-400 text-7xl">Connecting</span> Ideas</h1>
                    <h1 className = "my-2 text-gray-600">and <span className = "text-indigo-400 text-7xl">People</span></h1>
                    <button className = "my-2 text-xl bg-indigo-400 p-2 border border-indigo-400 rounded-md font-semibold text-white \
                    hover:bg-transparent hover:text-indigo-400" onClick = {() => {
                        navigate("/write");
                    }}>Get Started</button>
                </div>
            </div>
        </div>
    );
}

export default HomeComponent;