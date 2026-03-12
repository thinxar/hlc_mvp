import { BiCheckCircle } from 'react-icons/bi'

interface IOptions {
    onClose: () => void
}
const SubmissionModal = (props: IOptions) => {
    const { onClose } = props;
    return (
        <div>
            <>
                <div
                    onClick={onClose}
                    className="flex items-center justify-center p-0"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded2xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        <div className="p-8 text-center space-y-6">
                            <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                <BiCheckCircle className="w-10 h-10" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-gray-900">Submission Successful</h2>
                                <p className="text-gray-500">
                                    Your documents have been successfully recorded in the system.
                                    Our compliance team will review them shortly.
                                </p>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={onClose}
                                    className="w-full cursor-pointer py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
                                >
                                    Great, thanks!
                                </button>
                            </div>
                        </div>

                        <div className="h-2 bg-blue-600 w-full" />
                    </div>
                </div>
            </>
        </div>
    )
}

export { SubmissionModal }

