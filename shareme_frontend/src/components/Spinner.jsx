import React from 'react';
import {ThreeDots} from "react-loader-spinner";

const Spinner = ({ message }) => {
    return (
        <div className="flex flex-col justify-center items-center h-full w-full">
            <ThreeDots
                height="80"
                width="80"
                color="#00BFFF"
                className="m-5"
            />

            <p className="text-lg text-center px-2">{message}</p>
        </div>
    );
};

export default Spinner;