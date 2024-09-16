import React from "react";
import { Link } from "react-router-dom";

const Settings = () => {
    return (
        <div>
            <p>Settings</p>
            <Link to="/migrator">
                <button>Go to Home</button>
            </Link>
        </div>
    );
};

export default Settings;
