import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import UserList from "./UserList";
import HeaderInfo from "./HeaderInfo";

export default function UserPage() {
    let params = useParams();
    const [userData, setUserData] = useState({});
    const [urlHistory, setUrlHistory] = useState([]);

    useEffect(() => {
        // useEffect to handle url change, when url changes it automatically scrolles to start
        // of the page and fetches the single user data.
        window.scrollTo(0, 0);
        axios
            .get(
                `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${params.id}`
            )
            .then(function (response) {
                setUserData(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [params]);

    useEffect(() => {
        // this adds name id in searching history state, to make dynamic links.
        if (userData.name !== undefined) {
            setUrlHistory([
                ...urlHistory,
                { name: userData.name, id: userData.id },
            ]);
        }
    }, [userData.name]);

    return (
        <div>
            {/* it checkes if userData state is not empty object and shows user info */}
            {userData.id !== undefined && <HeaderInfo userData={userData} />}
            <div className="margin-left">
                <p>
                    {urlHistory.length > 0 &&
                        urlHistory.map(({ id, name }, index) => {
                            return (
                                <Link to={`/user/${id}`} key={index}>
                                    {`${name}${
                                        index !== urlHistory.length - 1
                                            ? ">"
                                            : ""
                                    }`}
                                </Link>
                            );
                        })}
                </p>
                <h1>FRIENDS :</h1>
            </div>
            <UserList
                url={`http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${params.id}/friends`}
            />
        </div>
    );
}
