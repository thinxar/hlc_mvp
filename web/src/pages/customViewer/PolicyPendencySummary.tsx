import { LuClock3, LuLayoutGrid } from "react-icons/lu";
import { FiAlertCircle, FiAlertTriangle } from "react-icons/fi";
import { topic } from "@palmyralabs/ts-utils";
import { useEffect, useState } from "react";

const PENDENCY_CONFIG = [
    {
        label: "Total",
        key: "total",
        icon: LuLayoutGrid,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        activeBg: "bg-blue-200",
        activeBorder: "border-blue-500",
        activeBar: "bg-blue-600",
        activeValue: "text-blue-900",
        activeLabel: "text-blue-700",
    },
    {
        label: "< 3",
        key: "<3",
        icon: LuClock3,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        activeBg: "bg-emerald-200",
        activeBorder: "border-emerald-500",
        activeBar: "bg-emerald-600",
        activeValue: "text-emerald-900",
        activeLabel: "text-emerald-700",
    },
    {
        label: "3–10",
        key: "3-10",
        icon: FiAlertTriangle,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        activeBg: "bg-amber-200",
        activeBorder: "border-amber-500",
        activeBar: "bg-amber-600",
        activeValue: "text-amber-900",
        activeLabel: "text-amber-700",
    },
    {
        label: "Above 10",
        key: ">10",
        icon: FiAlertCircle,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        activeBg: "bg-red-200",
        activeBorder: "border-red-500",
        activeBar: "bg-red-600",
        activeValue: "text-red-900",
        activeLabel: "text-red-700",
    },
];

interface IOptions {
    counts: any;
}

export default function PolicyPendencySummary(props: IOptions) {
    const { counts } = props;
    const [active, setActive] = useState("total");

    const handleClick = (key: any) => {
        setActive(key);
        topic.publish("pendencyKey", key);
    };

    useEffect(() => {
        const handle = topic.subscribe("pendencyKey", (_t: string, data: any) => {
            if (data) {
                setActive(data);
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
                            "relative flex items-center justify-between gap-3 px-4 py-2 rounded-2xl cursor-pointer",
                            "overflow-hidden select-none border transition-all duration-200 ease-in-out",
                            isActive
                                ? `${item.activeBg} ${item.activeBorder} shadow-sm`
                                : `${item.iconBg} border-transparent opacity-80 hover:opacity-90 hover:scale-[1.02]`,
                        ].join(" ")}
                    >
                        <div
                            className={[
                                "absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-all duration-200",
                                isActive ? item.activeBar : "bg-transparent",
                            ].join(" ")}
                        />

                        <div
                            className={[
                                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
                                isActive ? item.iconBg : "bg-white",
                            ].join(" ")}
                        >
                            <Icon
                                size={16}
                                strokeWidth={2}
                                className={[
                                    "transition-colors duration-200",
                                    item.iconColor,
                                ].join(" ")}
                            />
                        </div>

                        <div className="flex flex-col min-w-0 text-end">
                            <span
                                className={[
                                    "text-xs font-semibold mb-0.5 transition-colors duration-200",
                                    isActive ? item.activeLabel : "text-gray-600",
                                ].join(" ")}
                            >
                                {item.label}
                                {item.key !== "total" ? " Days" : ""}
                            </span>

                            <span
                                className={[
                                    "text-2xl font-bold leading-none tracking-tight transition-colors duration-200",
                                    isActive ? item.activeValue : "text-gray-800",
                                ].join(" ")}
                            >
                                {counts?.[item.key] ?? 0}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
