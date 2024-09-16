import React from "react";
import { Link } from "react-router-dom";

const Docs = () => {
    return (
        <div>
            <p>Docs</p>
            <Link to="/migrator">
                <button>Go to Home</button>
            </Link>
        </div>
    );
};

export default Docs;
