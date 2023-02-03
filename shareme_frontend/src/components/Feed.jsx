import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";

import { client } from "../client";
import MasonryLayout from './MasonryLayout';
import Spinner from "./Spinner";
import {searchQuery} from "../utils/data";
import {feedQuery} from "../utils/data";
import {HiOutlineEmojiSad} from "react-icons/hi";

const Feed = () => {

    const [loading, setLoading] = useState(true);
    const { categoryId } = useParams();
    const [pins, setPins] = useState(null);

    useEffect(() => {
        if (categoryId) {
            const query = searchQuery(categoryId);

            client.fetch(query)
                .then(data => {
                    setPins(data)
                    setLoading(false);
                })
        } else {
            client.fetch(feedQuery)
                .then(data => {
                    setPins(data)
                    setLoading(false);
                })
        }
    }, [categoryId])

    if (loading) return <Spinner message="We are adding new ideas to your feed!" />

    if (!pins?.length) return (
        <div className="flex flex-row justify-center items-center gap-2">
            <HiOutlineEmojiSad fontSize={40}/>
            <h2 className="text-2xl">No pins available</h2>
        </div>
    )

    return (
        <div>
            {pins && <MasonryLayout pins={pins} />}
        </div>
    );
};

export default Feed;