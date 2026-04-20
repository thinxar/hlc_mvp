import { useState } from "react";
import { FaEye, FaUserCheck } from "react-icons/fa";
import { FiBarChart2, FiLock } from "react-icons/fi";
import { MdDashboard, MdOutlineVideoLibrary } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { LicLogo } from 'templates/FlexImport';
import { storePolicyInfo } from "utils/LocalStorageInfo";

const appData = [
    {
        id: 1,
        title: "Revival",
        path: '/app/customViewer/submission',
        description: "New Document Verification Queue",
        icon: FaUserCheck,
        accent: "bg-blue-500 text-white hover:bg-yellow-400 hover:text-blue-900 transition",
        btnAccent: "bg-white text-gray-600 border border-gray-200 group-hover:bg-yellow-400 group-hover:text-blue-900 transition",
        glow: "shadow-blue-900/30",
        key: "REV",
    },
    {
        id: 2,
        title: "Ananda",
        path: '/app/customViewer/NG',
        description: "Read Only Document CDV i.e. without Accept/Reject Functionality",
        icon: FaEye,
        accent: "bg-blue-500 text-white hover:bg-yellow-400 hover:text-blue-900 transition",
        btnAccent: "bg-white text-gray-600 border border-gray-200 group-hover:bg-yellow-400 group-hover:text-blue-900 transition",
        glow: "shadow-blue-900/30",
        key: "AND",
    },
    {
        id: 3,
        title: "Policy Bazaar",
        path: '/app/customViewer/NG',
        description: "Read Only Document and Video CDV",
        icon: MdOutlineVideoLibrary,
        accent: "bg-blue-500 text-white hover:bg-yellow-400 hover:text-blue-900 transition",
        btnAccent: "bg-white text-gray-600 border border-gray-200 group-hover:bg-yellow-400 group-hover:text-blue-900 transition",
        glow: "shadow-blue-900/30",
        key: "PBV",
    },
    {
        id: 4,
        title: "Policy Documents",
        path: '/login',
        description: "Enter your credentials to access your account",
        icon: FiLock,
        accent: "bg-blue-500 text-white hover:bg-yellow-400 hover:text-blue-900 transition",
        btnAccent: "bg-white text-gray-600 border border-gray-200 group-hover:bg-yellow-400 group-hover:text-blue-900 transition",
        glow: "shadow-blue-900/30",
        key: "AUTH",
    },
    {
        id: 5,
        title: "Overview Dashboard",
        path: '/app/customViewer/dashboard',
        description: "Overview of system performance and activity",
        icon: FiBarChart2,
        accent: "bg-blue-500 text-white hover:bg-yellow-400 hover:text-blue-900 transition",
        btnAccent: "bg-white text-gray-600 border border-gray-200 group-hover:bg-yellow-400 group-hover:text-blue-900 transition",
        glow: "shadow-blue-900/30",
        isHighlight: true,
        key: "DASH",
    },
    {
        id: 6,
        title: "DO Dashboard",
        path: '/app/customViewer/doDashboard',
        description: "Division Office insights and performance tracking",
        icon: MdDashboard,
        accent: "bg-blue-500 text-white hover:bg-yellow-400 hover:text-blue-900 transition",
        btnAccent: "bg-white text-gray-600 border border-gray-200 group-hover:bg-yellow-400 group-hover:text-blue-900 transition",
        glow: "shadow-blue-900/30",
        isHighlight: true,
        key: "DODASH",
    },
];


export default function LandingPage() {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(null);

    const handleClick = (d: any) => {
        console.log(d?.path + '?appname=' + d?.key);

        if (d?.key == 'REV') {
            navigate(d?.path);
        } else {
            window.open(d?.path + '?appname=' + d?.key, '_blank');
        }
        storePolicyInfo(d?.title)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-6 py-16 relative overflow-hidden 
                        bg-linear-to-br from-[#eef2ff] via-[#f8fafc] to-[#e0f2fe]">

            <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-blue-300/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-purple-300/30 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[250px] bg-cyan-200/30 rounded-full blur-[100px]" />

            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="text-center mb-12 z-10">
                <div className="flex items-center justify-center">
                    <img src={LicLogo} className="h-20 w-35" />
                </div>
                <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-3">
                    EDMS 3.0
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-6xl z-10">
                {appData.map((mod: any) => (
                    <div
                        key={mod.id}
                        onMouseEnter={() => setHovered(mod.id)}
                        onMouseLeave={() => setHovered(null)}
                        className={`
                    group relative rounded-2xl border border-gray-200 bg-white
                    p-6 cursor-pointer overflow-hidden
                    transition-all duration-300 flex flex-col
                    ${hovered === mod.id
                                ? "shadow-xl -translate-y-1 border-gray-300"
                                : "hover:shadow-md"}
                `}
                    >
                        <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br ${mod.accent}`}
                            style={{ opacity: hovered === mod.id ? 0.08 : 0 }}
                        />

                        <div className="flex items-start justify-between mb-4">
                            <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-linear-to-br ${mod.accent} shadow`}
                            >
                                <span className="text-white">{<mod.icon />}</span>
                            </div>
                        </div>

                        <h2 className="text-gray-900 font-bold text-lg mb-1.5">
                            {mod.title}
                        </h2>

                        <p className="text-gray-500 text-sm mb-5">
                            {mod.description}
                        </p>

                        <button onClick={() => handleClick(mod)}
                            className={`
                        flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold
                        bg-linear-to-r ${mod.btnAccent} w-fit cursor-pointer
                        transition-all duration-200 mt-auto z-99
                        hover:scale-105 hover:shadow-md active:scale-95
                    `}
                        >
                            Open
                            <svg
                                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}