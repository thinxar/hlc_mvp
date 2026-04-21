import { useCallback, useEffect, useState } from "react";

export interface SRRecord {
    srNumber: string;
    approvedCount: number;
    rejectedCount: number;
}

export interface SRDocumentModalProps {
    onClose: () => void;
    month: string;
    params: string
    type: 'monthly' | 'weekly' | 'daily'
    // srList: SRRecord[];
}

// const d = {
//     grain: "monthly",
//     fromBucket: "2026-03-01",
//     toBucket: "2026-03-31",
//     processedDocuments: 49219,
//     perApprover: [
//         {
//             approvedBy: "10040081",
//             approvedCount: 12,
//             rejectedCount: 0
//         },
//         {
//             approvedBy: "10041317",
//             approvedCount: 7,
//             rejectedCount: 0
//         },
//     ]
// }


function SRTable({
    srList,
}: {
    srList: SRRecord[];
}) {
    return (
        <div className="rounded-[14px] overflow-hidden border border-black/8 dark:border-white/[0.07]">
            <table className="w-full border-collapse text-[12px]">

                <thead>
                    <tr className="bg-[#f7f8fa] dark:bg-white/3 border-b border-black/[0.07] dark:border-white/[0.07]">
                        {[
                            { label: "SR number", dot: null, align: "text-left" },
                            { label: "Approved", dot: "bg-green-600 dark:bg-[#4CAF76]", align: "text-right" },
                            { label: "Rejected", dot: "bg-red-500 dark:bg-[#FF5A5A]", align: "text-right" },
                            { label: "Total", dot: "bg-blue-500 dark:bg-[#4A9DFF]", align: "text-right" }
                        ].map(({ label, dot, align }) => (
                            <th
                                key={label}
                                className={`px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap text-gray-400 dark:text-white/30 ${align}`}
                            >
                                <span className="inline-flex items-center gap-1.5">
                                    {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />}
                                    {label}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {srList?.map((sr: any) => {
                        const approved = sr.approvedCount;
                        const rejected = sr.rejectedCount;
                        const total = approved + rejected;


                        return (
                            <tr
                                key={sr.srNumber}
                                className="border-b border-black/5 dark:border-white/4 last:border-none
                  hover:bg-blue-50/60 dark:hover:bg-white/3 transition-colors"
                            >
                                <td className="px-3.5 py-2.5 font-semibold  text-xs tracking-tight text-blue-700 dark:text-[#4A9DFF] whitespace-nowrap">
                                    {sr.srNumber}
                                </td>

                                <td className="px-3.5 py-2.5 text-right">
                                    <div className="text-sm font-semibold dark:text-gray-300">
                                        {approved}
                                    </div>
                                </td>

                                <td className="px-3.5 py-2.5 text-right">
                                    <div className="text-sm font-semibold dark:text-gray-300">
                                        {rejected}
                                    </div>
                                </td>

                                <td className="px-3.5 py-2.5 text-right">
                                    <div className="text-sm font-semibold dark:text-gray-300">
                                        {total}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}


import { ServiceEndpoint } from "config/ServiceEndpoint";
import {
    CheckCircle2,
    FileText,
    Layers,
    X,
    XCircle
} from "lucide-react";
import { useFormstore } from "wire/StoreFactory";
import SrTableFooter from "./SrTableFooter";

function SummaryBar({ srList }: { srList: SRRecord[] }) {
    const totalSR = srList?.length;

    const approved = srList?.reduce((sum, a) => sum + a.approvedCount, 0);
    const rejected = srList?.reduce((sum, a) => sum + a.rejectedCount, 0);
    const totalDocs = approved + rejected;

    const stats = [
        {
            label: "Total SR",
            value: totalSR,
            icon: FileText,
            bg: "bg-blue-50 dark:bg-blue-900/20",
            text: "text-blue-600 dark:text-blue-400"
        },
        {
            label: "Total Documents",
            value: totalDocs,
            icon: Layers,
            bg: "bg-gray-100 dark:bg-gray-800",
            text: "text-gray-700 dark:text-gray-200"
        },
        {
            label: "Approved",
            value: approved,
            icon: CheckCircle2,
            bg: "bg-green-50 dark:bg-green-900/20",
            text: "text-green-700 dark:text-green-400"
        },
        {
            label: "Rejected",
            value: rejected,
            icon: XCircle,
            bg: "bg-red-50 dark:bg-red-900/20",
            text: "text-red-600 dark:text-red-400"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
            {stats.map((s) => {
                const Icon = s.icon;
                return (
                    <div
                        key={s.label}
                        className="items-center gap-3 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition"
                    >
                        <div className={`flex items-center justify-between`}>
                            <div className={`flex p-2 rounded-xl ${s.bg}`}>
                                <Icon className={`w-4 h-4 ${s.text}`} />
                            </div>
                            <span className={`text-lg font-semibold ${s.text}`}>
                                {s.value}
                            </span>
                        </div>

                        <div className="text-end">

                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {s.label}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


export default function SRDocumentModal({
    onClose,
    month,
    params,
    type
}: SRDocumentModalProps) {
    const [filter, setFilter] = useState<"all" | "approved" | "rejected">("all");
    const [search, setSearch] = useState("");
    const [data, setData] = useState<any>({})

    const [apiTotalCount, setApiTotalCount] = useState<number | undefined>(0);
    const [pageIndex, setPageIndex] = useState<number>(0);

    const dataPerPage = 15;
    const offset = pageIndex * dataPerPage;
    const totalPagesCount = Math.ceil((apiTotalCount || 0) / (dataPerPage || 1));

    const documentSummaryApi = ServiceEndpoint.customView.rev.dashboard.documentSummaryApi
    const endPoint = `${documentSummaryApi}?window=approverBreakdown&grain=${type}&${params}?_total=true&_offset=${offset}&_limit=${dataPerPage}`

    const srList: SRRecord[] = data?.perApprover?.map((item: any) => ({
        srNumber: item.approvedBy,
        approvedCount: item.approvedCount,
        rejectedCount: item.rejectedCount
    }));

    useEffect(() => {
        useFormstore(endPoint, {}, '').get({}).then((d: any) => {
            setData(d);
            setApiTotalCount(d?.total)
        });
    }, [pageIndex]);

    useEffect(() => {
        setFilter("all");
        setSearch("");
    }, [srList]);

    const handleKey = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [handleKey]);

    const filteredSR = srList?.filter((sr) => {
        const matchFilter =
            filter === "all" ||
            (filter === "approved" && sr.approvedCount > 0) ||
            (filter === "rejected" && sr.rejectedCount > 0);

        const matchSearch =
            search === "" ||
            sr.srNumber.toLowerCase().includes(search.toLowerCase());

        return matchFilter && matchSearch;
    });


    if (!open) return null;

    return (
        <div
            className="flex items-center justify-center p-0"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="
          relative w-full max-w-5xl max-h-[90vh] flex flex-col
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700/60
          rounded-2xl overflow-hidden
          animate-[modalIn_0.18s_ease-out]
        "
            >


                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700/60 shrink-0">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            SR Document Status Summary — {month}
                        </h2>
                        <p className="text-[12px] text-gray-400 dark:text-gray-500">
                            Overview of approved, rejected documents by SR
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X />
                    </button>
                </div>

                <SummaryBar srList={srList} />

                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 dark:border-gray-700/60 shrink-0">
                    <div className="relative flex-1">
                        <svg
                            width="14" height="14" viewBox="0 0 16 16" fill="none"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search SR number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="
                w-full pl-8 pr-3 py-1.5 text-[13px] rounded-lg
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-800 dark:text-gray-200
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                transition-colors
              "
                        />
                    </div>
                </div>

                <div className="flex flex-1 min-h-0 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 min-w-0">
                        {filteredSR?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-2">
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-gray-300 dark:text-gray-600">
                                    <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M12 18h12M18 12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                                </svg>
                                <p className="text-sm text-gray-400 dark:text-gray-500">No documents match your filter</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-2">
                                    <SRTable srList={filteredSR} />
                                    <SrTableFooter setPageIndex={setPageIndex} pageIndex={pageIndex} totalPagesCount={totalPagesCount} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
