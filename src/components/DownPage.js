import React from "react";
import Footer from "./Footer";
import { Health } from "../api/API";
import { useHistory } from "react-router-dom"

export default function DownPage() {

    const history = useHistory();

    setInterval(function () {
        async function fetchHealth() {
            let response = await Health();
            if (response && response.status === 200) history.push(`/`);
        }
        fetchHealth()
    }, 5000);

    return (
        <div className="flex flex-col items-center my-8 md:my-12">
            <div className="w-full flex flex-col items-center mt-48">
                <p className="font-black text-4xl italic">We'll be right back!</p>
                <p className="mb-1 font-thin"><span className="title text-3xl font-black text-blue-600 mr-1">Stratego</span> is down for maintenance</p>
            </div>
            <div className="absolute bottom-8 md:bottom-12">
                <Footer />
            </div>
       </div>
    )
}
