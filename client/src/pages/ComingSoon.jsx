import React from 'react';

const ComingSoon = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-black">
            <h1 className="text-6xl font-serif text-gold-accent mb-6 animate-pulse">Coming Soon</h1>
            <p className="text-xl text-gray-300 max-w-md mx-auto">
                Our detectives are currently investigating this feature.
                Stay tuned for more updates from the archives.
            </p>
            <div className="mt-12 w-16 h-1 bg-gold-accent rounded-full"></div>
        </div>
    );
};

export default ComingSoon;
