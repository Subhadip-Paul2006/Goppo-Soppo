import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import BottomPlayer from './components/BottomPlayer';

const Layout = () => {
    return (
        <div className="flex h-screen w-full bg-black text-white overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full relative">
                <TopBar />
                <div className="flex-1 overflow-y-auto pb-28 bg-gradient-to-b from-detective-black to-black">
                    <Outlet />
                </div>
                <BottomPlayer />
            </div>
        </div>
    );
};

export default Layout;
