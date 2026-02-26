import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import BottomPlayer from './BottomPlayer';

const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (
        <div className="flex h-screen bg-black overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Fixed */}
            <div className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:relative md:translate-x-0 w-64 h-full flex-shrink-0 bg-[#121212]`}>
                <Sidebar setIsMobileMenuOpen={setIsMobileMenuOpen} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative overflow-hidden w-full">
                {/* TopBar */}
                <div className="flex-shrink-0 bg-black/90 backdrop-blur-md z-10">
                    <TopBar toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pb-28 bg-gradient-to-b from-detective-black to-black">
                    <Outlet />
                </div>

                {/* Bottom Player */}
                <BottomPlayer />
            </div>
        </div>
    );
};

export default Layout;

