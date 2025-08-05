import { FaRegFileLines } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const PolicyPdfList = ({ policies, searchTerm }: { policies: any[], searchTerm: string }) => {
    return (
        <div className="w-full max-w-4xl">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Policy Documents</h2>
                <p className="text-white/60">
                    {policies.reduce((total, policy) => total + policy.pdfFiles.length, 0)} PDF files found for "{searchTerm}"
                </p>
            </div>

            <div className="space-y-6">
                {policies.map((policy, index) => (
                    <PolicyCard key={policy.id} policy={policy} policyIndex={index} />
                ))}
            </div>
        </div>
    );
};

export { PolicyPdfList };



const PolicyCard = ({ policy, policyIndex }: { policy: any, policyIndex: number }) => {
    const navigate = useNavigate();

    const onCardClick = (type: string) => {
        if (type == 'pdf')
            navigate('/app/pdfViewer')
        else
            navigate('/app/tiffViewer')
    }

    return (
        <div className="animate-fade-in-up" style={{ animationDelay: `${policyIndex * 100}ms` }}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white/90 mb-2">Policy #{policy.id}</h3>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>


            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {policy.pdfFiles.map((pdf: any, pdfIndex: number) => (
                    <div
                        key={`${policy.id}_${pdfIndex}`}
                        onClick={() => onCardClick(pdf.type)}
                        className="group bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg animate-fade-in-up"
                        style={{ animationDelay: `${(policyIndex * 100) + (pdfIndex * 50)}ms` }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 flex-shrink-0">
                                <FaRegFileLines className="w-5 h-5 text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white mb-1 truncate">{pdf.name}</h4>
                                <p className="text-white/60 text-xs mb-2 truncate">{pdf.fileName}</p>
                                <div className="flex justify-between items-center text-xs text-white/50">
                                    <span>{pdf.size}</span>
                                    <span>{pdf.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PolicyCard;