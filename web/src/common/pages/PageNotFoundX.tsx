import React from 'react';
import { GiGhost } from "react-icons/gi";
import { IoArrowBack } from "react-icons/io5";

interface PageNotFoundProps {
    msg?: string;
}

const PageNotFoundX: React.FC<PageNotFoundProps> = ({ msg }) => {

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto flex items-center justify-center bg-slate-50  transition-colors duration-300 p-4">
            <div className="max-w-md w-full text-center">
                {<div
                    className="space-y-8"
                >
                    <div className="relative inline-block">
                        <div
                        >
                            <GiGhost size={120} className="text-indigo-500  mx-auto opacity-20 absolute -top-12 -left-12 -rotate-12" />
                            <h1 className="text-7xl font-black text-slate-900  tracking-tighter">
                                404
                            </h1>
                        </div>
                        <div className="absolute -bottom-2 left-0 w-full h-4 bg-indigo-500/20  blur-xl rounded-full" />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold text-slate-800  italic font-serif">
                            {msg ? msg : 'Oops! Page not found'}
                        </h2>
                        <p className="text-slate-500  max-w-xs mx-auto text-sm leading-relaxed">
                            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => window.history.back()}
                            className="cursor-pointer group flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 bg-white  border border-slate-200  rounded-full hover:bg-slate-50  transition-all shadow-sm active:scale-95"
                        >
                            <IoArrowBack size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </button>
                        {/* <button
                            onClick={() => window.location.href = '/'}
                            className="cursor-pointer flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-full transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            <AiFillHome size={16} />
                            Back to Login
                        </button> */}
                    </div>
                </div>
                }
            </div>
        </div>
    );
};

export default PageNotFoundX;
