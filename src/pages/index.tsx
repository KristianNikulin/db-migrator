import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import RootLayout from "./layout";

const HomePage = lazy(() => import("./home"));
const NotFound = lazy(() => import("./not-found"));

const App = () => {
    return (
        <Router>
            <RootLayout>
                <Suspense fallback={<p>Loading...</p>}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<HomePage />} />

                        <Route path="/404" element={<NotFound />} />
                        <Route path="*" element={<Navigate to="/404" />} />
                    </Routes>
                </Suspense>
            </RootLayout>
        </Router>
    );
};

export default App;
