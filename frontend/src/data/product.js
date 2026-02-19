import axios from "axios";
import { useNavigate } from "react-router-dom";

// const navigate = useNavigate();

const api = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getProducts = async () => {
    try {
        const response = await axios.get(`${api}/product`);
        // console.log(response?.data?.data);
        return response?.data?.data.products;
    } catch (error) {
        console.log(error);
    }
};

const getProductBySlug = async ({ params }) => {
    try {
        const { slug } = params;
        const token = localStorage.getItem("token");
        const response = await axios.get(`${api}/product/${slug}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return response.data.data;
    } catch (error) {
        console.error(error);
        throw new Response("Product not found", { status: 404 });
    }
};


export { getProducts, getProductBySlug };
