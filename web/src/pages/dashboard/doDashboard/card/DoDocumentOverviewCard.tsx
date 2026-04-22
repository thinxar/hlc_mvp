import { Percent } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FaCodeBranch } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { PiBriefcase } from 'react-icons/pi';
import { useFormstore } from 'wire/StoreFactory';
import { formatAmount } from 'utils/FormateDate';

interface IOptions {
    title?: string
    endPoint: string
    filter?: any
}

const DoDocumentOverviewCard = (props: IOptions) => {
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
        const endpoint = query ? `${endPoint}?${query}` : endPoint;
        useFormstore(endpoint, {}, '').get({}).then((d) => {
            if (d)
                setData(d)
        })
    }, [query])

    const approvalRate = data?.processedDocuments / data?.submittedDocuments * 100

    const cards = [
        {
            title: "Total Branches",
            value: formatAmount(data?.totalBranches, true),
            icon: FaCodeBranch,
            gradient: "from-blue-400 via-blue-500 to-blue-600",
            iconBg: "bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-100/10 dark:to-blue-200/10",
            textColor: "text-blue-700 dark:text-blue-400"

        },
        {
            title: "Total Document",
            value: formatAmount(data?.submittedDocuments, true),
            icon: IoDocumentTextOutline,
            gradient: "from-amber-400 via-orange-500 to-red-500",
            iconBg: "bg-linear-to-br from-amber-100 to-orange-200 dark:from-amber-100/10 dark:to-orange-200/10",
            textColor: "text-orange-700 dark:text-orange-400",
        },
        {
            title: "Total Processed",
            value: formatAmount(data?.processedDocuments, true),
            icon: PiBriefcase,
            gradient: "from-emerald-400 via-green-500 to-emerald-600",
            iconBg: "bg-linear-to-br from-emerald-100 to-green-200 dark:from-emerald-100/10 dark:to-green-600/10",
            textColor: "text-emerald-700 dark:text-emerald-400"
        },
        {
            title: "Processed Rate(%)",
            value: Math.round(approvalRate),
            icon: Percent,
            gradient: "from-teal-400 via-cyan-500 to-blue-500",
            iconBg: "bg-linear-to-br from-teal-100 to-cyan-200 dark:from-teal-100/10 dark:to-cyan-200/10",
            textColor: "text-teal-700 dark:text-teal-400"
        }
    ];

    return (
        <div className="w-full mx-auto mb-3">
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
                            <div className={`relative rounded-2xl shadow-md  border dark:bg-gray-800/40 bg-white
                                dark:border-white/10 border-gray-300 backdrop-blur-sm overflow-hidden transition-all duration-500`}>
                                <div className="relative p-3 z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`${card.iconBg} p-2.5 rounded-2xl shadow-lg transform group-hover:rotate-2 group-hover:scale-105 transition-all duration-300`}>
                                            <IconComponent className={`w-6 h-6 ${card.textColor} drop-shadow-sm`} />
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

export { DoDocumentOverviewCard };

