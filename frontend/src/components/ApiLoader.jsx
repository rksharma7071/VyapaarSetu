import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import LoadingPage from "./LoadingPage";

function ApiLoader() {
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(false);

    const increment = () => setCount((c) => c + 1);
    const decrement = () => setCount((c) => Math.max(0, c - 1));

    useEffect(() => {
        let timer;
        if (count > 0) {
            timer = setTimeout(() => setShow(true), 250);
        } else {
            setShow(false);
        }
        return () => clearTimeout(timer);
    }, [count]);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (config?.showLoader === false) return config;
                increment();
                return config;
            },
            (error) => {
                decrement();
                return Promise.reject(error);
            },
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => {
                if (response?.config?.showLoader === false) return response;
                decrement();
                return response;
            },
            (error) => {
                if (error?.config?.showLoader !== false) decrement();
                return Promise.reject(error);
            },
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    if (!show) return null;
    return <LoadingPage />;
}

export default ApiLoader;
