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
    { key: "bucket3_10", label: "3–10 Days", color: "#f78807", bg: "#fffbeb", border: "#fcd34d" },
    { key: "bucketAbove_10", label: "Above 10 Days", color: "#f2370d", bg: "#ffebeb", border: "#fcd34d" }

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
        <div className="flex items-center gap-1.5">
            <div className="w-12 h-2 rounded bg-gray-100 overflow-hidden shrink-0">
                <div
                    className="h-full rounded transition-all duration-400 ease-in-out"
                    style={{
                        width: `${pct}%`,
                        background: color,
                    }}
                />
            </div>
            <span className="text-xs font-bold text-gray-900 min-w-[22px] text-right">
                {value}
            </span>
        </div>
    );
}

function BucketBadge({ label, color }: Pick<BucketMeta, "label" | "color" | "bg" | "border">) {
    return (
        <div className="rounded-2xl " style={{ color: color }}>
            <span className="inline-block font-semibold text-[12px] " >
                {label}
            </span>
        </div>
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

    return (
        <div className="bg-white border border-gray-200 rounded shadow-lg overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-200 flex flex-wrap justify-between items-start gap-4">
                <div>
                    <div className="text-base font-semibold text-gray-700">{title}</div>
                    <div className="text-xs text-gray-400">
                        Case counts per category × age bucket · {rows.length} categories
                    </div>
                </div>
            </div>

            <div className="overflow-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="px-3 py-2 text-left text-[12px] text-gray-800 font-bold border-b-2 border-gray-200 border-r sticky top-0 bg-white z-10">
                                Category
                            </th>

                            {BUCKETS.map((b) => (
                                <th
                                    key={b.key}
                                    onMouseEnter={() => setHighlightBucket(b.key)}
                                    onMouseLeave={() => setHighlightBucket(null)}
                                    className="p-2 text-left text-[11px] font-bold border-b border-r border-gray-200 sticky top-0 bg-white z-10 cursor-pointer"
                                >
                                    <BucketBadge {...b} />
                                </th>
                            ))}

                            <th className="px-3 py-2 text-[12px] text-right font-bold text-gray-800 border-b-2 border-gray-200 sticky top-0 bg-white z-10">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={BUCKETS.length + 2}
                                    className="py-10 text-center text-sm text-gray-400"
                                >
                                    No categories match "{search}"
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => {
                                const total = getTotal(row);

                                return (
                                    <tr key={row.id} className="aging-row">
                                        <td className="px-2 py-1 border-b border-gray-100 border-r bg-white sticky left-0 z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {row.category}
                                                </div>
                                            </div>
                                        </td>

                                        {BUCKETS.map((b) => {
                                            const val = row[b.key];
                                            const isHighlighted = highlightBucket === b.key;

                                            return (
                                                <td
                                                    key={b.key}
                                                    className={`px-2 py-1 border-b border-gray-100 border-r transition-all duration-150 
                        ${isHighlighted ? "" : "bg-white"}`}
                                                    style={isHighlighted ? { background: b.bg } : {}}
                                                >
                                                    <SparkBar
                                                        value={val}
                                                        max={colMax[b.key]}
                                                        color={b.color}
                                                    />
                                                </td>
                                            );
                                        })}

                                        <td className="px-3 py-1 border-b border-gray-100 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-base font-black text-sky-500">
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
                        <tr className="border-t-2 border-gray-200">

                            <td className="px-3 py-1 bg-gray-50 sticky left-0 border-r border-gray-200">
                                <span className="text-xs font-extrabold text-gray-900 tracking-wide">
                                    COLUMN TOTAL
                                </span>
                            </td>

                            {BUCKETS.map((b) => {
                                const colTotal = getColumnTotal(rows, b.key);

                                return (
                                    <td
                                        key={b.key}
                                        className="px-3 py-1 bg-gray-50 border-r border-gray-200"
                                    >
                                        <span
                                            className="text-sm font-extrabold"
                                            style={{ color: b.color }}
                                        >
                                            {colTotal}
                                        </span>
                                    </td>
                                );
                            })}

                            <td className="px-3 py-1 bg-sky-50 text-right">
                                <span className="text-lg font-black text-sky-600">
                                    {grandTotal}
                                </span>
                            </td>

                        </tr>
                    </tfoot>

                </table>
            </div>
        </div>

    );

}
