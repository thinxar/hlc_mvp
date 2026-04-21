import { CalendarDays, CheckCircle, Clock, FileText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { formatAmount } from 'utils/FormateDate';
import { useFormstore } from 'wire/StoreFactory';

interface IOptions {
    title?: string
    endPoint: string
    filter?: any
}

interface ICaseCard {
    total: number | string
    approved: number | string,
    rejected: number | string,
    pending: number | string,
    todayProcessed: number | string
    todayCases?: number | string
    processedDocuments: number | string
}

const CaseOverviewCard = (props: IOptions) => {
    const { title, endPoint, filter } = props;
    const [data, setData] = useState<any>(null);

    const buildQueryParams = (filter: any) => {
        const params = new URLSearchParams();
        Object.entries(filter).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, String(value));
            }
        });
        return params.toString();
    };

    const query = useMemo(() => buildQueryParams(filter), [filter]);
    useEffect(() => {

        const query = buildQueryParams(filter);
        const endpoint = query ? `${endPoint}&${query}` : endPoint;

        useFormstore(endpoint, {}, '').get({}).then((d) => {
            if (d)
                setData(d)
        })
    }, [query])

    const cases: ICaseCard = {
        total: data ? formatAmount(data.totalDocuments, true) : 0,
        approved: data ? formatAmount(data.approvedDocuments, true) : 0,
        rejected: data ? formatAmount(data.rejectedDocuments, true) : 0,
        pending: data ? formatAmount(data.pendingDocuments, true) : 0,
        todayProcessed: data ? formatAmount(data.todayProcessed?.totalProcessed, true) : 0,
        processedDocuments: data ? formatAmount(data.processedDocuments, true) : 0,
    };

    const cards = [
        {
            title: "Total Documents",
            value: cases.total,
            icon: FileText,
            gradient: "from-blue-400 via-blue-500 to-blue-600",
            iconBg: "bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-100/10 dark:to-blue-200/10",
            textColor: "text-blue-700 dark:text-blue-400"

        },
        // {
        //     title: "Approved Documents",
        //     value: cases.approved,
        //     icon: CheckCircle,
        //     gradient: "from-emerald-400 via-green-500 to-emerald-600",
        //     iconBg: "bg-linear-to-br from-emerald-100 to-green-200 dark:from-emerald-100/10 dark:to-green-600/10",
        //     textColor: "text-emerald-700 dark:text-emerald-400"
        // },
        {
            title: "Processed Documents",
            value: cases.processedDocuments,
            icon: CheckCircle,
            gradient: "from-emerald-400 via-green-500 to-emerald-600",
            iconBg: "bg-linear-to-br from-emerald-100 to-green-200 dark:from-emerald-100/10 dark:to-green-600/10",
            textColor: "text-emerald-700 dark:text-emerald-400"
        },
        // {
        //     title: "Rejected Cases",
        //     value: cases.rejected,
        //     icon: XCircle,
        //     gradient: "from-red-400 via-red-500 to-red-500",
        //     iconBg: "bg-linear-to-br from-red-100 to-red-200 dark:from-red-100/10 dark:to-red-200/10",
        //     textColor: "text-red-700 dark:text-red-400",
        // },
        {
            title: "Pending Documents",
            value: cases.pending,
            icon: Clock,
            gradient: "from-amber-400 via-orange-500 to-red-500",
            iconBg: "bg-linear-to-br from-amber-100 to-orange-200 dark:from-amber-100/10 dark:to-orange-200/10",
            textColor: "text-orange-700 dark:text-orange-400",
        },
        {
            title: "Today's Progress",
            value: cases.todayProcessed,
            icon: CalendarDays,
            gradient: "from-teal-400 via-cyan-500 to-blue-500",
            iconBg: "bg-linear-to-br from-teal-100 to-cyan-200 dark:from-teal-100/10 dark:to-cyan-200/10",
            textColor: "text-teal-700 dark:text-teal-400"
        }
    ];

    return (
        <div className="w-full mx-auto px-0 pb-3">
            {title &&
                <span className="text-xl font-semibold">{title}</span>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4  2xl:grid-cols-4 gap-3 mt-2">
                {cards.map((card, index) => {
                    const IconComponent = card.icon;
                    return (
                        <div
                            key={index}
                            className={`relative group transform transition-all duration-500`}
                        >
                            <div className={`relative rounded-2xl shadow-sm  border dark:bg-gray-900 bg-white
                                dark:border-white/10 border-white/50 backdrop-blur-sm overflow-hidden transition-all duration-500`}>
                                <div className="relative p-3 z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`${card.iconBg} p-2.5 rounded-2xl shadow-lg transform group-hover:rotate-2 group-hover:scale-105 transition-all duration-300`}>
                                            <IconComponent className={`w-7 h-7 ${card.textColor} drop-shadow-sm`} />
                                        </div>
                                        <div className="text-end break-all whitespace-normal">
                                            <div className="flex items-baseline gap-2 justify-end">
                                                <h3 className={`text-xl font-bold 
                                                dark:text-gray-200 text-gray-700 leading-none tracking-tight`}>
                                                    {card.value}
                                                </h3>
                                                <div className={`w-2 h-2 rounded-full bg-linear-to-r ${card.gradient}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className={`text-md font-bold dark:text-gray-400 text-gray-600`}>
                                            {card.title}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export { CaseOverviewCard };

