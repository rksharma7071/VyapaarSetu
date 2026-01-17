import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";


export const MyContext = createContext(null);

export const MyContextProvider = ({ children }) => {
    const name = "Retesh";
    const [products, setProducts] = useState([]);

    useEffect(()=> {
        const getProducts = async ()=> {
            try {
                const res = axios.get(`${import.meta.env.VITE_API}/api/book`)
                setProducts(res.data);
                console.log("Products: ",res.data);
            } catch (error) {
                
            }
        }
        getProducts();
    }, [])

    return (
        <MyContext.Provider value={{name, products}}>
            {children}
        </MyContext.Provider>
    )
}

export const useMyContext = () => {
  return useContext(MyContext);
};