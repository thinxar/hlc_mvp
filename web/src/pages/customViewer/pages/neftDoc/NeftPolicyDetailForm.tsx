import { Copy } from "lucide-react";

interface PolicyData {
    id: number;
    policyNumber: number;
    uid: number[];
    advReferenceNumber: string[];
}

interface PolicySidebarProps {
    policy: PolicyData;
}

export default function NeftPolicyDetailForm({ policy }: PolicySidebarProps) {
    return (
        <aside className="flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shrink-0">

            <div className="px-3.5 pt-2 pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-500">
                            Policy info
                        </span>
                    </div>
                    <div className="mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900">
                            <span className="text-xs text-blue-400 dark:text-blue-500">Policy no.</span>
                            <span className="text-sm font-semibold font-mono text-blue-700 dark:text-blue-300">
                                {policy.policyNumber}
                            </span>
                        </span>
                    </div>
                </div>

                <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-2">
                    UIDs
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                    {policy.uid.map((u) => (
                        <span
                            key={u}
                            className="text-xs  px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                        >
                            {u}
                        </span>
                    ))}
                </div>

                <hr className="border-gray-200 dark:border-gray-800 my-2" />

                <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                    ADV Reference Numbers
                </p>
            </div>
            <div className="overflow-y-auto px-3.5 pb-2 pt-1 flex flex-col gap-1">
                {policy?.advReferenceNumber.map((ref: any, i: number) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors min-w-0"
                    >
                        <span className="text-[9px] font-semibold font-sans px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0 tracking-wide">
                            R{String(i + 1).padStart(2, "0")}
                        </span>

                        <span className="text-xs  text-gray-800 dark:text-gray-400 truncate flex-1 min-w-0">
                            {ref}
                        </span>

                        <button
                            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(ref); }}
                            className="shrink-0 cursor-pointer text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
                        >
                            <Copy className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </aside>
    );
}