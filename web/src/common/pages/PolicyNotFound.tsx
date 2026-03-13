import { BiSearch } from "react-icons/bi"
import { MdClose } from "react-icons/md"

const PolicyNotFound = () => {
    return (
        <div>
            <div className="min-h-screen flex items-center justify-center p-6 font-sans">
                <div
                    className="max-w-lg w-full text-center"
                >
                    <div className="mb-10">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-xl shadow-slate-200/50 mb-6">
                            <BiSearch size={40} className="text-slate-400" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-700 tracking-tight mb-4">
                            Policy Not Found
                        </h1>
                        <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full mb-6"></div>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                            The policy or serial number you're looking for doesn't exist in our records.
                        </p>
                    </div>


                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => window.close()}
                            className="w-full flex items-center gap-3 cursor-pointer sm:w-auto px-6 py-4 bg-slate-200 text-gray-700 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-lg shadow-slate-200 active:scale-95"
                        >
                            <MdClose size={22}/>
                            Close This Tab
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { PolicyNotFound }

