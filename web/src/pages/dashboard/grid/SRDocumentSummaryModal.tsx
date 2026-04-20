import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SRDocument {
    id: string;
    title: string;
    type: "PDF" | "DOCX" | "XLSX" | "IMG";
    status: "approved" | "rejected";
    uploadedBy: string;
    date: string;
    size: string;
    pages?: number;
    reason?: string;
}

export interface SRRecord {
    srNumber: string;
    requester: string;
    department: string;
    documents: SRDocument[];
}

export interface SRDocumentModalProps {
    onClose: () => void;
    month: string;
    srList: SRRecord[];
}

export const MOCK_SR_LIST: SRRecord[] = [
    {
        srNumber: "SR-2024040001",
        requester: "Arjun Mehta",
        department: "Finance",
        documents: [
            { id: "d1", title: "Q1 Budget Report.pdf", type: "PDF", status: "approved", uploadedBy: "Arjun Mehta", date: "04 Apr 2024", size: "2.4 MB", pages: 18 },
            { id: "d2", title: "Invoice_March.xlsx", type: "XLSX", status: "approved", uploadedBy: "Arjun Mehta", date: "04 Apr 2024", size: "480 KB" },
            { id: "d3", title: "Expense_Claim.pdf", type: "PDF", status: "rejected", uploadedBy: "Arjun Mehta", date: "05 Apr 2024", size: "1.1 MB", pages: 6, reason: "Missing authorisation signature" },
        ],
    },
    {
        srNumber: "SR-2024040002",
        requester: "Priya Nair",
        department: "Operations",
        documents: [
            { id: "d4", title: "Vendor_Contract_v2.docx", type: "DOCX", status: "approved", uploadedBy: "Priya Nair", date: "06 Apr 2024", size: "890 KB", pages: 32 },
            { id: "d5", title: "SLA_Compliance.pdf", type: "PDF", status: "rejected", uploadedBy: "Priya Nair", date: "06 Apr 2024", size: "3.2 MB", pages: 45, reason: "Outdated template version" },
        ],
    },
    {
        srNumber: "SR-2024040003",
        requester: "Karthik Rajan",
        department: "IT",
        documents: [
            { id: "d6", title: "Server_Audit.pdf", type: "PDF", status: "approved", uploadedBy: "Karthik Rajan", date: "08 Apr 2024", size: "5.6 MB", pages: 72 },
            { id: "d7", title: "Network_Diagram.img", type: "IMG", status: "approved", uploadedBy: "Karthik Rajan", date: "08 Apr 2024", size: "1.8 MB" },
            { id: "d8", title: "Change_Request.docx", type: "DOCX", status: "rejected", uploadedBy: "Karthik Rajan", date: "09 Apr 2024", size: "320 KB", pages: 5, reason: "Incomplete risk assessment section" },
            { id: "d9", title: "Patch_Notes.pdf", type: "PDF", status: "approved", uploadedBy: "Karthik Rajan", date: "10 Apr 2024", size: "740 KB", pages: 12 },
        ],
    },
    {
        srNumber: "SR-2024040004",
        requester: "Divya Suresh",
        department: "HR",
        documents: [
            { id: "d10", title: "Onboarding_Policy.pdf", type: "PDF", status: "approved", uploadedBy: "Divya Suresh", date: "10 Apr 2024", size: "1.2 MB", pages: 24 },
            { id: "d11", title: "Employee_Form_April.docx", type: "DOCX", status: "rejected", uploadedBy: "Divya Suresh", date: "11 Apr 2024", size: "210 KB", pages: 3, reason: "Duplicate submission detected" },
        ],
    },
    {
        srNumber: "SR-2024040005",
        requester: "Rahul Desai",
        department: "Legal",
        documents: [
            { id: "d12", title: "NDA_Draft_v3.docx", type: "DOCX", status: "approved", uploadedBy: "Rahul Desai", date: "12 Apr 2024", size: "670 KB", pages: 8 },
            { id: "d13", title: "Compliance_Report.pdf", type: "PDF", status: "approved", uploadedBy: "Rahul Desai", date: "12 Apr 2024", size: "4.1 MB", pages: 60 },
        ],
    },
];

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
                    {srList.map((sr) => {
                        const approved = sr.documents.filter((d) => d.status === "approved").length;
                        const rejected = sr.documents.filter((d) => d.status === "rejected").length;
                        const total = sr.documents.length;

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


import {
    FileText,
    Layers,
    CheckCircle2,
    XCircle,
    X
} from "lucide-react";

function SummaryBar({ srList }: { srList: SRRecord[] }) {
    const totalSR = srList.length;
    const totalDocs = srList.flatMap((s) => s.documents).length;
    const approved = srList.flatMap((s) => s.documents)
        .filter((d) => d.status === "approved").length;
    const rejected = totalDocs - approved;

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
    srList,
}: SRDocumentModalProps) {
    const [filter, setFilter] = useState<"all" | "approved" | "rejected">("all");
    const [search, setSearch] = useState("");

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

    const filteredSR = srList
        .map((sr) => ({
            ...sr,
            documents: sr.documents.filter((d) => {
                const matchFilter = filter === "all" || d.status === filter;
                const matchSearch =
                    search === "" ||
                    d.title.toLowerCase().includes(search.toLowerCase()) ||
                    sr.srNumber.toLowerCase().includes(search.toLowerCase());
                return matchFilter && matchSearch;
            }),
        }))
        .filter((sr) => sr.documents.length > 0);

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
                        {/* <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg> */}
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
                        {filteredSR.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-2">
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-gray-300 dark:text-gray-600">
                                    <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M12 18h12M18 12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                                </svg>
                                <p className="text-sm text-gray-400 dark:text-gray-500">No documents match your filter</p>
                            </div>
                        ) : (
                            <SRTable srList={filteredSR} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}