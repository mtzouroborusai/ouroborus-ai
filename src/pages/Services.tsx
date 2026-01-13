import React from 'react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
            <Link to="/" className="text-emerald-400 hover:text-emerald-300 mb-6 inline-block">&larr; Back to Hub</Link>

            <header className="text-center mb-16 max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold font-mono mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                    Digital Solutions
                </h1>
                <p className="text-xl text-slate-400">
                    Elevate your brand with premium web design and data-driven marketing strategies.
                </p>
            </header>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
                {/* Web Design */}
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-all group">
                    <div className="text-5xl mb-6">🎨</div>
                    <h2 className="text-3xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">Web Design & Development</h2>
                    <ul className="space-y-3 text-slate-300 mb-8">
                        <li className="flex items-center gap-2">✓ Custom UI/UX Design</li>
                        <li className="flex items-center gap-2">✓ React & Next.js Applications</li>
                        <li className="flex items-center gap-2">✓ Responsive & Mobile-First</li>
                        <li className="flex items-center gap-2">✓ Performance Optimization</li>
                    </ul>
                    <button className="w-full py-3 rounded-lg border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all font-bold">
                        View Portfolio
                    </button>
                </div>

                {/* Marketing */}
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-cyan-500 transition-all group">
                    <div className="text-5xl mb-6">📈</div>
                    <h2 className="text-3xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">Digital Marketing</h2>
                    <ul className="space-y-3 text-slate-300 mb-8">
                        <li className="flex items-center gap-2">✓ SEO Strategy & Audit</li>
                        <li className="flex items-center gap-2">✓ Social Media Management</li>
                        <li className="flex items-center gap-2">✓ Content Creation</li>
                        <li className="flex items-center gap-2">✓ Analytics & Reporting</li>
                    </ul>
                    <button className="w-full py-3 rounded-lg border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all font-bold">
                        Get a Quote
                    </button>
                </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-12 max-w-4xl mx-auto text-center border border-slate-700">
                <h2 className="text-3xl font-bold mb-4">Ready to start your project?</h2>
                <p className="text-slate-400 mb-8">
                    Contact us today for a free consultation. Let's build something infinite together.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-slate-700 px-6 py-3 rounded-full text-white w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-full font-bold text-white shadow-lg shadow-emerald-500/30 transition-all">
                        Let's Talk
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Services;
