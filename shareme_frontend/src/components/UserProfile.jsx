import React, {useEffect, useState} from 'react';
import { AiOutlineLogout } from "react-icons/ai";
import { googleLogout } from '@react-oauth/google';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from "../utils/data";
import { client } from "../client";
import Spinner from "./Spinner";
import {useNavigate, useParams} from "react-router-dom";
import MasonryLayout from "./MasonryLayout";
import {fetchUser} from "../utils/fetchUser";

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [pins, setPins] = useState(null);
    const [text, setText] = useState('Created');
    const [activeBtn, setActiveBtn] = useState('created');
    const navigate = useNavigate();
    const { userId } = useParams();

    const User = fetchUser();

    useEffect(() => {
        const query = userQuery(userId);

        client.fetch(query)
            .then(data => {
                setUser(data[0])
            })
    }, [userId])

    useEffect(() => {
            if (text === 'Created') {
                const createdPinsQuery = userCreatedPinsQuery(userId);

                client.fetch(createdPinsQuery)
                    .then(data => {
                        setPins(data)
                    })
            } else {
                const savedPinsQuery = userSavedPinsQuery(userId);

                client.fetch(savedPinsQuery)
                    .then(data => {
                        setPins(data)
                    })
            }
        }, [text, userId])

    if (!user) {
        return <Spinner message="Loading profile..."/>
    }

    const logout = () => {
        console.log('Выполнено');
        localStorage.clear();
        googleLogout();

        navigate('/login');
    }

    return (
        <div className="relative pb-2 h-full flex justify-center items-start">
            <div className="flex flex-col pb-5 w-full">
                <div className="relative flex flex-col mb-7">
                    <div className="flex flex-col justify-center items-center">

                        {/* main picture */}
                        <img
                            src="https://mobimg.b-cdn.net/v3/fetch/94/94c56e15f13f1de4740a76742b0b594f.jpeg"
                            alt="banner-pic"
                            className="w-full h-[370px] 2xl:h-510 shadow-lg object-cover"
                        />
                        {/* user image */}
                        <img
                            src={user.image}
                            className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
                            alt="user-pic"
                        />
                        <h1 className="font-bold text-3xl text-center mt-3">
                            {user.userName}
                        </h1>

                        {/* Google Logout */}
                        <div className="absolute top-0 z-1 right-0 p-2">
                            {userId === User.sub && (

                                <button
                                    type="button"
                                    className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                                    onClick={logout}
                                >
                                    <AiOutlineLogout fontSize={21} color="red" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* buttons 'Saved/Creat */}
                    <div className="text-center mb-7">
                        <button
                            type="button"
                            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
                            onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn('created');
                            }}
                        >
                            Created
                        </button>
                        <button
                            type="button"
                            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
                            onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn('saved');
                            }}
                        >
                            Saved
                        </button>
                    </div>

                    {/* list with created/saved pins */}
                    {pins?.length ? (
                        <div className="px-2">
                            <MasonryLayout pins={pins} />
                        </div>
                        ) : (
                        <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
                            No Pins Found!
                        </div>
                        )}

                </div>
            </div>
        </div>
    );
};

export default UserProfile;