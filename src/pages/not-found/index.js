import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div>
            <p>Page not found</p>
            <Link to="/home">
                <button>Go to Home</button>
            </Link>
        </div>
    );
};

export default NotFound;
