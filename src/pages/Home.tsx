import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl mix-blend-screen animate-pulse delay-1000"></div>
            </div>

            <header className="z-10 text-center mb-16">
                <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 font-mono">
                    OUROBORUS AI
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    Infinite cycles of innovation. The central hub for intelligent applications.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-10 w-full max-w-6xl">
                {/* Driving Test Card */}
                <Link to="/driving-test" className="group">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:border-cyan-500 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] h-full flex flex-col">
                        <div className="mb-4 text-4xl">🚗</div>
                        <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">Driving Test</h2>
                        <p className="text-slate-400 flex-grow">
                            Master your driving theory exam with our interactive simulator based on real questions.
                        </p>
                        <div className="mt-6 flex items-center text-cyan-400 font-semibold group-hover:translate-x-2 transition-transform">
                            Start Simulation &rarr;
                        </div>
                    </div>
                </Link>

                {/* Lost Animals Card */}
                <Link to="/lost-animals" className="group">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:border-purple-500 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] h-full flex flex-col">
                        <div className="mb-4 text-4xl">🐾</div>
                        <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">Lost Animals</h2>
                        <p className="text-slate-400 flex-grow">
                            Reuniting pets with their families. Post alerts and search the community database.
                        </p>
                        <div className="mt-6 flex items-center text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                            Find a Friend &rarr;
                        </div>
                    </div>
                </Link>

                {/* Services Card */}
                <Link to="/services" className="group">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:border-emerald-500 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] h-full flex flex-col">
                        <div className="mb-4 text-4xl">✨</div>
                        <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">Services</h2>
                        <p className="text-slate-400 flex-grow">
                            Premium Web Design & Marketing Solutions. Elevate your digital presence.
                        </p>
                        <div className="mt-6 flex items-center text-emerald-400 font-semibold group-hover:translate-x-2 transition-transform">
                            Explore Services &rarr;
                        </div>
                    </div>
                </Link>
            </div>

            <footer className="absolute bottom-4 text-slate-600 text-sm">
                &copy; {new Date().getFullYear()} Ouroborus AI. All rights reserved.
            </footer>
        </div>
    );
};

export default Home;
