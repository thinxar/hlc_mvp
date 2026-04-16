import { useNavigate } from "react-router-dom";
import { storePolicyInfo } from "utils/LocalStorageInfo";

const LandingPage = () => {
    const navigate = useNavigate();

    const cards = [
        { title: "Revival ", path: "/item-creation", desc: "New Document Verification Queue" },
        { title: "Ananda", path: "/master-data", desc: "Read Only Document CDV i.e. without Accept/Reject Functionality" },
        { title: "Policy Bazaar", path: "/reports", desc: "Read Only Document and Video CDV" },
        { title: "Sign in", path: "/login", desc: "Enter your credentials to access your account." },
    ];

    const handleClick = (val: any) => {
        // navigate(val?.path);
        navigate('app/customViewer/submission');
        storePolicyInfo(val?.title)
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-gray-800">
                    Initial Rendering Page
                </h1>
                <p className="text-gray-500 mt-2">
                    Select a module to continue
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-6xl">
                {cards.map((card, index) => (
                    <div key={index}
                        className="cursor-pointer p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 border border-gray-100"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {card.title}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {card.desc}
                        </p>
                        <div className="mt-4">
                            <button
                                onClick={() => handleClick(card)}
                                className="px-5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl 
             shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 
             active:scale-95 transition-all duration-200 ease-in-out"
                            >
                                Open →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LandingPage