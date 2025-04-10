import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import RootLayout from "./layout";

const Docs = lazy(() => import("./docs"));
const Loading = lazy(() => import("./loading"));
const Migrator = lazy(() => import("./migrator"));
const Settings = lazy(() => import("./settings"));
const NotFound = lazy(() => import("./not-found"));

//! fallback={<Loading />} надо ???

const App = () => {
    return (
        <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <RootLayout>
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/migrator" />} />
                        <Route path="/migrator" element={<Migrator />} />
                        <Route path="/docs" element={<Docs />} />
                        <Route path="/settings" element={<Settings />} />

                        <Route path="/404" element={<NotFound />} />
                        <Route path="*" element={<Navigate to="/404" />} />
                    </Routes>
                </Suspense>
            </RootLayout>
        </Router>
    );
};

export default App;
