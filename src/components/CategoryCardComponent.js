import { useNavigate, useParams } from "react-router-dom";

const CategoryCardComponent = ({categoryName, catId}) => {
    const navigate = useNavigate();
    const {categoryId} = useParams();

    return (
        <div className = {`m-5 px-5 w-fit py-12 inline-block
        font-semibold text-xl rounded-md shadow-sm hover:text-white hover:bg-indigo-400 hover:cursor-pointer
        ${(Number(categoryId) === catId) ? "bg-indigo-400 text-white" : "bg-white text-gray-500"}`}
        onClick = {() => {
            navigate(`/discuss/${catId}`);
        }
        }>
            <h1>{categoryName}</h1>
        </div>
    );
}

export default CategoryCardComponent;