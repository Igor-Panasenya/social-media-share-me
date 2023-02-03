import React, {useState} from 'react';
import { client, urlFor } from "../client";
import {Link, useNavigate} from "react-router-dom";
import { animated, useSpring } from '@react-spring/web';
import { v4 as uuidv4 } from 'uuid' ;
import {MdDownloadForOffline} from "react-icons/md";
import {fetchUser} from "../utils/fetchUser";
import {BsFillArrowUpRightCircleFill} from "react-icons/bs";
import {AiTwotoneDelete} from "react-icons/ai";

const Pin = ({ pin }) => {

    const { postedBy, image, _id, destination } = pin;
    const [postHovered, setPostHovered] = useState(false);
    const navigate = useNavigate();
    const user = fetchUser();
    const [savingPost, setSavingPost] = useState(false);

    let alreadySaved = pin?.save?.filter(item => item?.postedBy?._id === user?.sub);
    alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

    const savePin = (id) => {

        if (alreadySaved?.length === 0) {
            setSavingPost(true);

            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user?.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?.sub
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                    setSavingPost(false)
                })
        }
    }
    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload();
            })
    }

    const stylesImage = useSpring({
        from: { opacity: 0, y: 100},
        to: { opacity: 1, y: 0 },
        config: {duration: 500},
    })
    const stylesUser = useSpring({
        from: { opacity: 0, y: -30},
        to: { opacity: 1, y: 0 },
        delay: 100,
        config: {duration: 400},
    })

    return (
        <div className="m-2">
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500ease-in-out"
            >


                {/* Pin Image */}
                <animated.div style={stylesImage} >

                    <img className="rounded-lg w-full" src={urlFor(image).width(350).url()} alt="user-post" />
                    {postHovered && (
                        <div
                            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pb-2 z-50"
                            style={{height: '100%'}}
                        >
                            <div className="flex items-center justify-between">

                                {/* button download image */}
                                <div className="flex gap-2">
                                    <a
                                        href={`${image?.asset?.url}?dl=`}
                                        download
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                                    >
                                        <MdDownloadForOffline />
                                    </a>
                                </div>

                                {/* button save image */}
                                {
                                    alreadySaved?.length !== 0 ? (
                                        <button
                                            type="button"
                                            className="bg-red-500 opacity-70 hover:opacity-100 text-[14px] text-white font-bold px-3 text-base rounded-3xl hover:shadow-md outlined-none"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {pin?.save?.length} Saved
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                savePin(_id);
                                            }}
                                            type="button" className="bg-red-500 opacity-70 hover:opacity-100 text-[14px] text-white font-bold px-3 text-base rounded-3xl hover:shadow-md outlined-none"
                                        >
                                            {pin?.save?.length}   {savingPost ? 'Saving' : 'Save'}
                                        </button>
                                    )
                                }
                            </div>


                            {/* button link destination */}
                            <div className="flex justify-between items-center gap-2 w-full">
                                {
                                    destination &&
                                    (
                                        <a
                                            href={destination}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-a rounded-full opacity-70 hover:100 hover:shadow-md"
                                        >
                                            <BsFillArrowUpRightCircleFill />
                                            {destination.length > 15 ? `${destination.slice(0, 15)}...` : destination}
                                        </a>
                                    )
                                }
                                {
                                    postedBy?._id === user?.sub &&
                                    (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deletePin(_id);
                                            }}
                                            type="button"
                                            className="bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outlined-none"
                                        >
                                            <AiTwotoneDelete />
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    )}

                </animated.div>

            </div>

            {/* link profile */}

            <animated.div style={stylesUser} >
                <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
                    <img
                        src={postedBy?.image}
                        className="w-8 h-8 rounded-full object-cover"
                        alt="user-image"
                    />
                    <p className="font-semibold capitalize">
                        {postedBy?.userName}
                    </p>
                </Link>
            </animated.div>

        </div>
    );
};

export default Pin;