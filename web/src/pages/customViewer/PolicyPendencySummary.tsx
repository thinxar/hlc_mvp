import { LuClock3, LuLayoutGrid } from "react-icons/lu";
import { FiAlertCircle, FiAlertTriangle } from "react-icons/fi";
import { topic } from "@palmyralabs/ts-utils";
import { useEffect, useState } from "react";

const PENDENCY_CONFIG = [
    {
        label: "Total",
        key: "total",
        icon: LuLayoutGrid,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        activeBg: "bg-blue-50",
        activeBorder: "border-blue-400",
        activeBar: "bg-blue-500",
        activeValue: "text-blue-800",
        activeLabel: "text-blue-500",
        dot: "bg-blue-500",
    },
    {
        label: "< 3",
        key: "<3",
        icon: LuClock3,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        activeBg: "bg-emerald-50",
        activeBorder: "border-emerald-400",
        activeBar: "bg-emerald-500",
        activeValue: "text-emerald-800",
        activeLabel: "text-emerald-500",
        dot: "bg-emerald-500",
    },
    {
        label: "3–10",
        key: "3-10",
        icon: FiAlertTriangle,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        activeBg: "bg-amber-50",
        activeBorder: "border-amber-400",
        activeBar: "bg-amber-500",
        activeValue: "text-amber-800",
        activeLabel: "text-amber-500",
        dot: "bg-amber-500",
    },
    {
        label: "Above 10",
        key: ">10",
        icon: FiAlertCircle,
        iconBg: "bg-red-50",
        iconColor: "text-red-500",
        activeBg: "bg-red-50",
        activeBorder: "border-red-400",
        activeBar: "bg-red-500",
        activeValue: "text-red-800",
        activeLabel: "text-red-500",
        dot: "bg-red-500",
    },
];

interface IOptions {
    counts: any
}

export default function PolicyPendencySummary(props: IOptions) {
    const { counts } = props;
    const [active, setActive] = useState("total");

    const handleClick = (key: any) => {
        setActive(key);
        topic.publish('pendencyKey', key)
    };

    useEffect(() => {
        const handle = topic.subscribe("pendencyKey", (_t: string, data: any) => {
            if (data) {
                setActive?.(data)
            }
        });
        return () => {
            topic.unsubscribe(handle);
        };
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PENDENCY_CONFIG.map((item) => {
                const isActive = active === item.key;
                const Icon = item.icon;

                return (
                    <div
                        key={item.key}
                        onClick={() => handleClick(item.key)}
                        className={[
                            "relative flex items-center justify-between gap-3 px-4 py-1.5 rounded-2xl cursor-pointer",
                            "overflow-hidden select-none transition-all duration-200 border",
                            isActive
                                ? `${item.activeBg} ${item.activeBorder} shadow-sm`
                                : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50",
                        ].join(" ")}
                    >
                        <div
                            className={[
                                "absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-colors duration-200",
                                isActive ? item.activeBar : item.activeBar,
                            ].join(" ")}
                        />
                        <div
                            className={[
                                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200",
                                isActive ? item.iconBg : item.iconBg,
                            ].join(" ")}
                        >
                            <Icon
                                size={14}
                                strokeWidth={2}
                                className={[
                                    "transition-colors duration-200",
                                    isActive ? item.iconColor : item.iconColor,
                                ].join(" ")}
                            />
                        </div>

                        <div className="flex flex-col min-w-0 text-end">
                            <span
                                className={[
                                    "text-xs font-semibold  mb-0.5 transition-colors duration-200",
                                    isActive ? item.activeLabel : "text-gray-400",
                                ].join(" ")}
                            >
                                {item.label}
                                {item.key !== "total" ? " Days" : ""}
                            </span>
                            <span
                                className={[
                                    "text-2xl font-bold leading-none tracking-tight transition-colors duration-200",
                                    isActive ? item.activeValue : "text-gray-700",
                                ].join(" ")}
                            >
                                {counts[item.key] ?? 0}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}