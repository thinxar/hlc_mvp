import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storePolicyInfo } from "utils/LocalStorageInfo";

const appData = [
    {
        id: 1,
        title: "Revival",
        path: 'app/customViewer/submission',
        description: "New Document Verification Queue",
        icon: "✦",
        accent: "from-violet-500 to-indigo-600",
        glow: "shadow-violet-500/30",
        tag: "QUEUE",
    },
    {
        id: 2,
        title: "Ananda",
        path: 'app/customViewer/submission',
        description: "Read Only Document CDV i.e. without Accept/Reject Functionality",
        icon: "◈",
        accent: "from-sky-400 to-blue-600",
        glow: "shadow-sky-500/30",
        tag: "READ ONLY",
    },
    {
        id: 3,
        title: "Policy Bazaar",
        path: 'app/customViewer/submission',
        description: "Read Only Document and Video CDV",
        icon: "⬡",
        accent: "from-emerald-400 to-teal-600",
        glow: "shadow-emerald-500/30",
        tag: "MEDIA",
    },
    {
        id: 4,
        title: "LIC Log in",
        path: '/login',
        description: "Enter your credentials to access your account",
        icon: "⊕",
        accent: "from-rose-400 to-pink-600",
        glow: "shadow-rose-500/30",
        tag: "AUTH",
    },
];

export default function LandingPage() {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(null);

    const handleClick = (d: any) => {
        navigate(d?.path);
        storePolicyInfo(d?.title)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gray-50 relative overflow-hidden">

            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-200 rounded-full blur-[120px] opacity-40" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-200 rounded-full blur-[120px] opacity-40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-100 rounded-full blur-[80px] opacity-40" />

            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="text-center mb-14 z-10">

                <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-3">
                    <span className="mr-2 bg-linear-to-r from-violet-500 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                        Policy
                    </span>
                     Document Processing{" "}
                </h1>

                <p className="text-gray-500 text-sm">
                    Select a module to continue
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl z-10">
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
                                <span className="text-white">{mod.icon}</span>
                            </div>

                            <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-full border border-gray-200 text-gray-500">
                                {mod.tag}
                            </span>
                        </div>

                        <h2 className="text-gray-900 font-bold text-lg mb-1.5">
                            {mod.title}
                        </h2>

                        <p className="text-gray-500 text-sm mb-5">
                            {mod.description}
                        </p>

                        <button onClick={() => handleClick(mod)}
                            className={`
                        flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white
                        bg-linear-to-r ${mod.accent} w-fit cursor-pointer
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