import { useMemo, useState } from "react";

export interface AgingRow {
    id: string;
    category: string;
    bucket0_3: number;
    bucket3_10: number;
    bucketAbove_10: number;
    bucket31_60: number;
    bucket61_90: number;
    bucketAbove90: number;
}

interface BucketMeta {
    key: keyof Omit<AgingRow, "id" | "category">;
    label: string;
    color: string;
    bg: string;
    border: string;
}

type SortKey = keyof AgingRow | "total";

type SortDir = "asc" | "desc";

export const INITIAL_AGING_DATA: AgingRow[] = [

    { id: "1", category: "New Policy", bucket0_3: 18, bucket3_10: 12, bucketAbove_10: 9, bucket31_60: 6, bucket61_90: 3, bucketAbove90: 2 },
    { id: "2", category: "Renewal", bucket0_3: 22, bucket3_10: 15, bucketAbove_10: 11, bucket31_60: 8, bucket61_90: 4, bucketAbove90: 1 },
    { id: "3", category: "Claim", bucket0_3: 10, bucket3_10: 8, bucketAbove_10: 14, bucket31_60: 12, bucket61_90: 9, bucketAbove90: 7 },
    { id: "4", category: "Surrender", bucket0_3: 6, bucket3_10: 5, bucketAbove_10: 4, bucket31_60: 3, bucket61_90: 2, bucketAbove90: 1 },
    { id: "5", category: "Loan", bucket0_3: 14, bucket3_10: 10, bucketAbove_10: 7, bucket31_60: 5, bucket61_90: 3, bucketAbove90: 2 },
    { id: "6", category: "Maturity", bucket0_3: 8, bucket3_10: 6, bucketAbove_10: 5, bucket31_60: 4, bucket61_90: 2, bucketAbove90: 0 },
    { id: "7", category: "Revival", bucket0_3: 11, bucket3_10: 9, bucketAbove_10: 6, bucket31_60: 4, bucket61_90: 2, bucketAbove90: 1 },
    { id: "8", category: "Assignment", bucket0_3: 4, bucket3_10: 3, bucketAbove_10: 3, bucket31_60: 2, bucket61_90: 1, bucketAbove90: 0 },
];

const BUCKETS: BucketMeta[] = [

    { key: "bucket0_3", label: "0–3 Days", color: "#16a34a", bg: "#f0fdf4", border: "#86efac" },
    { key: "bucket3_10", label: "3–10 Days", color: "#0891b2", bg: "#ecfeff", border: "#67e8f9" },
    { key: "bucketAbove_10", label: "Above 10 Days", color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
    // { key: "bucket31_60", label: "31–60 Days", color: "#ea580c", bg: "#fff7ed", border: "#fdba74" },
    // { key: "bucket61_90", label: "61–90 Days", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
    // { key: "bucketAbove90", label: ">90 Days", color: "#7f1d1d", bg: "#fef2f2", border: "#f87171" },

];

function getTotal(row: AgingRow): number {

    return BUCKETS.reduce((sum, b) => sum + row[b.key], 0);

}

function getColumnTotal(data: AgingRow[], key: keyof Omit<AgingRow, "id" | "category">): number {

    return data.reduce((sum, row) => sum + row[key], 0);

}

function getGrandTotal(data: AgingRow[]): number {

    return data.reduce((sum, row) => sum + getTotal(row), 0);

}

function SparkBar({ value, max, color }: { value: number; max: number; color: string }) {

    const pct = max > 0 ? Math.round((value / max) * 100) : 0;

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 48, height: 8, borderRadius: 4, background: "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>
                <div style={{

                    height: "100%", width: `${pct}%`,

                    background: color, borderRadius: 4,

                    transition: "width .4s ease",

                }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", minWidth: 22, textAlign: "right" }}>

                {value}
            </span>
        </div>
    );
}

function BucketBadge({ label }: Pick<BucketMeta, "label" | "color" | "bg" | "border">) {
    return (
        <span className="inline-block font-semibold text-[10px] text-gray-600" >
            {label}
        </span>

    );

}

interface AgingDetailTableProps {

    data?: AgingRow[];

    title?: string;

}

export default function AgingDetailsTable({
    data = INITIAL_AGING_DATA,
    title = "Case Aging Detail",

}: AgingDetailTableProps) {

    const [sortKey, _setSortKey] = useState<SortKey>("category");
    const [sortDir, _setSortDir] = useState<SortDir>("asc");
    const [search, _setSearch] = useState("");
    const [highlightBucket, setHighlightBucket] = useState<string | null>(null);

    const rows = useMemo(() => {
        const filtered = data.filter((r) =>
            r.category.toLowerCase().includes(search.toLowerCase())
        );

        return [...filtered].sort((a, b) => {
            const aVal = sortKey === "total" ? getTotal(a) : sortKey === "category" ? a.category : (a[sortKey as keyof AgingRow] as number);
            const bVal = sortKey === "total" ? getTotal(b) : sortKey === "category" ? b.category : (b[sortKey as keyof AgingRow] as number);
            if (typeof aVal === "string" && typeof bVal === "string")
                return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
        });

    }, [data, sortKey, sortDir, search]);


    const colMax = useMemo(() => {
        const result: Record<string, number> = {};
        BUCKETS.forEach((b) => { result[b.key] = Math.max(...data.map((r) => r[b.key]), 1); });
        return result;

    }, [data]);

    const grandTotal = getGrandTotal(rows); 

    const Th = ({  children, align = "left" }: { sk: SortKey; children: React.ReactNode; align?: string }) => (
        <th 
            style={{
                padding: "11px 14px",
                textAlign: align as "left" | "right" | "center",
                borderBottom: "2px solid #e2e8f0",
                borderRight: "1px solid #e2e8f0",
                fontSize: 11, fontWeight: 700,
                cursor: "pointer", userSelect: "none",
                whiteSpace: "nowrap",
                transition: "background .15s",
                position: "sticky", top: 0, zIndex: 2,
            }}
        >
            {children}
        </th>

    );

    return (
        <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,.06)",
            overflow: "hidden",
        }}>
            <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap%27);

        .aging-row:hover td { background: #f8fafc !important; }

        .aging-row.highlight-row td { background: #f0f9ff !important; }

        .aging-table { border-collapse: collapse; width: 100%; }

        .aging-table td { transition: background .12s; }

        ::-webkit-scrollbar { height: 5px; width: 5px; }

        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

      `}</style>

            <div style={{
                padding: "18px 22px 14px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                gap: 16, flexWrap: "wrap",
            }}>
                <div>
                    <div className="text-base font-semibold text-gray-700" >{title}</div>
                    <div className="text-[12px]  text-gray-400">
                        Case counts per category × age bucket · {rows.length} categories
                    </div>
                </div>
            </div>
            <div className="overflow-auto " >
                <table className="w-full">
                    <thead>
                        <tr>
                            <Th sk="category">Category</Th> 
                            {BUCKETS.map((b) => (
                                <th key={b.key} 
                                    onMouseEnter={() => setHighlightBucket(b.key)}
                                    onMouseLeave={() => setHighlightBucket(null)}
                                    className="sticky transition-all duration-100 p-2 text-left border-b border-r border-[#e2e8f0] cursor-pointer"
                                >
                                    <BucketBadge {...b} /> 
                                </th>

                            ))}
                            <Th sk="total" align="right">Total</Th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={BUCKETS.length + 2} style={{ padding: 36, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                                    No categories match "{search}"
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => {
                                const total = getTotal(row); 
                                return (
                                    <tr key={row.id} className="aging-row">
                                        <td style={{
                                            padding: "8px 10px",
                                            borderBottom: "1px solid #f1f5f9",
                                            borderRight: "1px solid #f1f5f9",
                                            background: "#fff",
                                            position: "sticky", left: 0, zIndex: 1,

                                        }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{row.category}</div>
                                                    
                                                </div>
                                            </div>
                                        </td>

                                        {BUCKETS.map((b) => {
                                            const val = row[b.key];
                                            const isHighlighted = highlightBucket === b.key;
                                            return (
                                                <td key={b.key} style={{
                                                    padding: "12px 14px",
                                                    borderBottom: "1px solid #f1f5f9",
                                                    borderRight: "1px solid #f1f5f9",
                                                    background: isHighlighted ? b.bg : "#fff",
                                                    transition: "background .15s",

                                                }}>
                                                    <SparkBar value={val} max={colMax[b.key]} color={b.color} />
                                                </td>

                                            );

                                        })}

                                        <td style={{ 
                                            padding: "12px 14px", 
                                            borderBottom: "1px solid #f1f5f9",  textAlign: "right",
                                        }}>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                                                <span style={{ fontSize: 15, fontWeight: 900, color: "#0ea5e9" }}>

                                                    {total}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                    <tfoot>
                        <tr style={{ borderTop: "2px solid #e2e8f0" }}>
                            <td style={{ 
                                padding: "8px 14px",
                                background: "#f8fafc",
                                position: "sticky", left: 0,
                                borderRight: "1px solid #e2e8f0",
                            }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", letterSpacing: 0.3 }}>

                                    COLUMN TOTAL
                                </span>
                            </td>

                            {BUCKETS.map((b) => {

                                const colTotal = getColumnTotal(rows, b.key);

                                return (
                                    <td key={b.key} style={{

                                        padding: "12px 14px",

                                        background: "#f8fafc",

                                        borderRight: "1px solid #e2e8f0",

                                    }}>
                                        <span style={{

                                            fontSize: 13, fontWeight: 800, color: b.color,

                                        }}>{colTotal}</span>
                                    </td>

                                );

                            })}
                            <td style={{ padding: "12px 14px", background: "#f0f9ff", textAlign: "right" }}>
                                <span style={{

                                    fontSize: 16, fontWeight: 900,

                                    color: "#0284c7"

                                }}>{grandTotal}</span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

    );

}
