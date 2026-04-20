import { PalmyraApexChart } from "@palmyralabs/rt-apexchart";
import { useRef } from "react";
import { useCommonChartStyles } from "../ChartTheme";
import type { IChartInput } from "../type";
import { formatDate } from "utils/FormateDate";

const MonthlyAcceptanceRateChart = (props: IChartInput) => {
    const { title, xKey, yKey, subText, endPoint } = props;
    const { commonOptions } = useCommonChartStyles();
    const clickFilter = useRef<{ departmentName: string }>(null);
    const rawData = useRef<any[]>([]);

    const transformChartData = (data: any): any => {
        const formatData = data?.map((item: any) => {
            const total =
                (item.submittedDocuments || 0) +
                (item.pendingDocuments || 0) +
                (item.processedDocuments || 0);

            return {
                calMonth: item.calMonth,
                submittedDocuments: total ? Math.round((item.submittedDocuments / total) * 100) : 0,
                pendingDocuments: total ? Math.round((item.pendingDocuments / total) * 100) : 0,
                processedDocuments: total ? Math.round((item.processedDocuments / total) * 100) : 0
            };
        });

        return formatData;
    }

    const options: any = {
        // ...commonOptions,
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 900,
            animateGradually: {
                enabled: true,
                delay: 120,
            },
            dynamicAnimation: {
                enabled: true,
                speed: 450,
            },
        },
        chart: {
            height: 400,
            type: 'bar',
            boxshadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            toolbar: {
                show: true,
                tools: {
                    download: true,
                },
            },
            zoom: false,
            events: {
                click: function (_event: any, chartContext: any, config: any) {
                    const dataPointIndex = config.dataPointIndex;
                    if (dataPointIndex != null) {
                        const allSeries = chartContext?.w?.config.series;
                        const xValue = allSeries[0]?.data[dataPointIndex]?.x;
                        clickFilter.current = { departmentName: xValue };
                    }
                }
            }
        },
        points: [{
            click: (event: any) => {
                console.log(event.target.value)
            }
        }
        ],

        plotOptions: {
            bar: {
                borderRadius: 6,
                borderRadiusApplication: 'end',
                columnWidth: '52%',
                horizontal: false
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return Math.round(val) + "%";
            }
        },
        tooltip: {
            enabled: true,
            custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
                const seriesName = w.config.series[seriesIndex]?.name;
                const value = series[seriesIndex][dataPointIndex];
                const xVal = w.config.series[0]?.data[dataPointIndex]?.x;
                const label = formatDate(xVal, 'month');

                if (seriesName === 'Processed' && rawData.current[dataPointIndex]) {
                    const row = rawData.current[dataPointIndex];
                    const approved = row.approvedDocuments ?? 0;
                    const rejected = row.rejectedDocuments ?? 0;
                    return `<div style="padding:8px;font-size:12px">
                        <b>${label}</b><br/>
                        <span style="color:#22c55e">Processed: ${value}%</span><br/>
                        <span style="color:#16a34a">&nbsp;&nbsp;Approved: ${approved}</span><br/>
                        <span style="color:#ef4444">&nbsp;&nbsp;Rejected: ${rejected}</span>
                    </div>`;
                }
                const color = w.config.colors[seriesIndex] || '#333';
                return `<div style="padding:8px;font-size:12px">
                    <b>${label}</b><br/>
                    <span style="color:${color}">${seriesName}: ${value}%</span>
                </div>`;
            }
        },
        legend: {
            show: true,
            position: 'top',
        },
        stroke: {
            show: true,
            width: 1,
            ...commonOptions.colors
        },
        title: {
            text: title,
            align: 'left',
            margin: 12,
            ...commonOptions.title
        },
        subtitle: {
            text: subText ? subText : '',
            align: 'left',
            ...commonOptions.subtitle
        },
        xaxis: {
            labels: {
                rotate: -45,
                formatter: (value: string) => {
                    const date = value;
                    return formatDate(date, 'month')
                }
            },
        },
        yaxis: {
            labels: {
                formatter: function (val: number) {
                    return Math.round(val) + "%";
                }
            },
        },
        colors: ['#3b82f6', '#f59e0b', '#22c55e'],
        active: {
            allowMultipleDataPointsSelection: true,
        },
        fill: {
            opacity: 0.8
        }
    }

    // const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData' });
    // const endPointX = '/MonthlyAcceptanceRate.json'
    return (
        <div id="chart">
            <PalmyraApexChart options={options} type="area"
                endPoint={endPoint} filter={props.filter}
                seriesOptions={[
                    { name: "Submitted", type: 'area' },
                    { name: "Pending", type: 'area' },
                    { name: "Processed", type: 'area' }
                ]} preProcess={(d: any) => { rawData.current = d; return transformChartData(d); }}
                height={props.height} width={'100%'} transformOptions={{ xKey: xKey, yKey: yKey, dataType: 'array' }}
            />
        </div>
    );

};

export { MonthlyAcceptanceRateChart };

