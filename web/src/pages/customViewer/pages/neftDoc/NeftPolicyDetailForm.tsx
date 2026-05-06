import { Copy } from "lucide-react";

interface PolicyList {
    uid: string;
    advReferenceNumbers: string[];
}

interface PolicyData {
    id: number;
    policyNumber: string;
    uidAdvreference: PolicyList[];
}

interface PolicySidebarProps {
    policy: PolicyData;
}

export default function NeftPolicyDetailForm({ policy }: PolicySidebarProps) {
    const totalUIDs = policy.uidAdvreference.length;
    const totalAdvRefs = policy.uidAdvreference.reduce((sum, item) => sum + item.advReferenceNumbers.length, 0);

    return (
        <aside className="flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shrink-0">
            <div className="px-3.5 pt-2 pb-2">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-500">
                            Policy info
                        </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900">
                        <span className="text-xs text-blue-400 dark:text-blue-500">Policy no.</span>
                        <span className="text-sm font-semibold font-mono text-blue-700 dark:text-blue-300">
                            {policy.policyNumber}
                        </span>
                    </span>
                </div>

                <div className="flex items-center gap-2">

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full 
    bg-indigo-50 dark:bg-indigo-900/30 
    text-indigo-700 dark:text-indigo-300
    border border-indigo-200/60 dark:border-indigo-700/50"
                    >
                        <span className="text-xs opacity-70">UIDs</span>
                        <span className="text-xs font-semibold font-mono">
                            {totalUIDs}
                        </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full 
    bg-purple-50 dark:bg-purple-900/30 
    text-purple-700 dark:text-emerald-300
    border border-purple-200/60 dark:border-emerald-700/50"
                    >
                        <span className="text-xs opacity-70">ADV Ref Numbers</span>
                        <span className="text-xs font-semibold font-mono">
                            {totalAdvRefs}
                        </span>
                    </div>

                </div>
            </div>

            <div className="px-3.5 pb-0">
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">

                    <div className="overflow-y-auto max-h-64">
                        <table className="w-full text-xs border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="text-left px-2.5 py-1.5 font-medium text-gray-500 dark:text-gray-400 border-r border-b border-gray-200 dark:border-gray-700 w-20">
                                        UID
                                    </th>
                                    <th className="text-left px-2.5 py-1.5 font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                        ADV Reference Number
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {policy.uidAdvreference.map((item, i) =>
                                    item.advReferenceNumbers.map((ref, j) => (
                                        <tr
                                            key={`${i}-${j}`}
                                            className="border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors"
                                        >
                                            {j === 0 && (
                                                <td
                                                    rowSpan={item.advReferenceNumbers.length}
                                                    className="px-2.5 py-1.5 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 align-middle"
                                                >
                                                    {item.uid}
                                                </td>
                                            )}

                                            <td className="px-2.5 py-1.5">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <span className=" text-gray-700 dark:text-gray-300 truncate flex-1">
                                                        {ref}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigator.clipboard.writeText(ref);
                                                        }}
                                                        className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors cursor-pointer"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </aside>
    );
}