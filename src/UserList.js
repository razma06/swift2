import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "react-loader-spinner";

export default function UserList({ url }) {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [isMore, setIsMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const handleScroll = () => {
        // function to handle scroll, it checks if user scrolled to bottom if true it increments
        //pages and than cleans scroll event listener.
        if (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
        ) {
            console.log("scrolled");
            setPage((previous) => previous + 1);
            document.removeEventListener("scroll", handleScroll);
        }
    };

    const fetchData = async () => {
        // when it start to fetch data, the loading state is set to true so icon shows up at
        // the bottom o fthe screen
        setLoading(true);
        await axios
            .get(`${url}/${page}/16`)
            .then(function (response) {
                // if data is empty this means there is no new data to fetch. so ismore state
                // is set to false, so no new scroll event listener will be set and there will not
                // be a new fetch.
                if (response.data.list.length === 0) {
                    setIsMore(false);
                } else {
                    setData([...data, ...response.data.list]);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        setLoading(false);
    };

    useEffect(() => {
        // it checks if there is more data to fetch.
        if (isMore) {
            fetchData();
        }

        // scroll cleanup.
        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    }, [page]);

    useEffect(() => {
        document.addEventListener("scroll", handleScroll);
        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    }, [data]);

    useEffect(() => {
        // this useefect is used to fetch new data list of user friends, when url changes.
        axios
            .get(`${url}/${page}/16`)
            .then(function (response) {
                setData(response.data.list);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [url]);

    return (
        <div>
            <div className="card-cont">
                {data.length > 0 &&
                    data.map(({ id, name, imageUrl, title }) => {
                        return (
                            <Link key={id} to={`/user/${id}`}>
                                <div className="card">
                                    <img
                                        src={imageUrl + "?v=" + id}
                                        alt={name}
                                    />
                                    <h2>{name}</h2>
                                    <p>{title}</p>
                                </div>
                            </Link>
                        );
                    })}
            </div>
            {loading && (
                <Loader
                    type="TailSpin"
                    color="#00bf33"
                    height={160}
                    width={160}
                    style={{ position: "absolute" }}
                />
            )}
        </div>
    );
}
