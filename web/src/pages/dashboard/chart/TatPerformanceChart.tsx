import { PalmyraApexChart } from "@palmyralabs/rt-apexchart";
import { useCommonChartStyles } from "../ChartTheme";
import type { IChartInput } from "../type";
import { formatDate } from "utils/FormateDate";

const BAND_KEYS = [
    "d0_5", "d6_10", "d11_20", "d21_30", "d31_45", "d45plus"
];

const TatPerformanceChart = (props: IChartInput) => {
    const { title, subText, endPoint } = props;
    const { commonOptions } = useCommonChartStyles();

    const options: any = {
        chart: {
            height: 400,
            type: 'bar',
            stacked: true,
            toolbar: { show: true, tools: { download: true } },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                columnWidth: '60%',
                horizontal: false
            }
        },
        dataLabels: { enabled: false },
        tooltip: { enabled: true },
        legend: { show: true, position: 'top' },
        stroke: { show: true, width: 1, ...commonOptions.colors },
        title: {
            text: title,
            align: 'left',
            margin: 12,
            ...commonOptions.title
        },
        subtitle: {
            text: subText || '',
            align: 'left',
            ...commonOptions.subtitle
        },
        xaxis: {
            labels: {
                rotate: -45,
                formatter: (value: string) => formatDate(value, 'month')
            },
        },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#f97316', '#ef4444', '#7c3aed'],
        fill: { opacity: 0.85 }
    };

    return (
        <div id="chart">
            <PalmyraApexChart options={options} type="bar"
                endPoint={endPoint} filter={props.filter}
                seriesOptions={[
                    { name: "0-5 days" },
                    { name: "6-10 days" },
                    { name: "11-20 days" },
                    { name: "21-30 days" },
                    { name: "31-45 days" },
                    { name: "45+ days" }
                ]}
                height={props.height} width={'100%'}
                transformOptions={{ xKey: "calMonth", yKey: BAND_KEYS, dataType: 'array' }}
            />
        </div>
    );
};

export { TatPerformanceChart };
