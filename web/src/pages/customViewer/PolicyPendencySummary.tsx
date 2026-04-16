
const PENDENCY_CONFIG = [
    { label: "Total", key: "total", color: "bg-blue-500" },
    { label: "< 3", key: "< 3", color: "bg-green-500" },
    { label: "3-10", key: "3-10", color: "bg-yellow-500" },
    { label: "> 10", key: "> 10", color: "bg-red-500" }
];


const getButtonClass = (isActive: any) => {
    let base =
        `flex flex-col items-start px-2 py-0.5 cursor-pointer
         rounded-xl border border-gray-200 bg-white transition-all duration-200 min-w-[85px] gap-1 hover:shadow-sm active:scale-[0.98]`;

    if (isActive) {
        base += " border-muted shadow-md ring-muted border-gray-300 bg-blue-300/10! border-blue-400!";
    }

    return base;
};

interface IOptions {
    counts: any,
    filter: any,
    toggleFilter?: (d: any) => void
}

const PolicyPendencySummary = (props: IOptions) => {
    const { counts, filter, toggleFilter } = props;
    return (
        <div>
            <div className="flex items-center gap-3">
                {PENDENCY_CONFIG?.map((item: any) => {
                    const isActive =
                        item.key === "total"
                            ? !filter?.pendency
                            : filter?.pendency === item.key;

                    return (
                        <button
                            key={item.key}
                            onClick={(_d: any) => toggleFilter?.(item.key)}
                            className={getButtonClass(isActive)}
                        >
                            <span className="text-[11px] font-bold text-muted
                            text-gray-500">
                                {item.label} {item.key == 'total' ? '' : 'Days'}
                            </span>

                            <div className="flex items-center justify-between w-full">
                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                <span className="text-lg font-bold">
                                    {counts[item.key]}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PolicyPendencySummary;
