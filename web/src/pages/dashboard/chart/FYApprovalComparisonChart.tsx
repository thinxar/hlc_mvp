import { PalmyraApexChart } from "@palmyralabs/rt-apexchart";
import { useRef } from "react";
import { formatDate } from "utils/FormateDate";
import { useCommonChartStyles } from "../ChartTheme";
import type { IChartInput } from "../type";

const getPrevFYLastMonthStart = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const fyYear = currentMonth < 3 ? currentYear - 1 : currentYear;

    const date = new Date(fyYear, 2, 1)
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
};

const getFY = (dateStr: string) => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = d.getMonth();

    return month < 3 ? year - 1 : year;
};


const FYApprovalComparisonChart = (props: IChartInput) => {
    const { title, xKey, yKey, subText, endPoint } = props;
    const { commonOptions } = useCommonChartStyles();
    const clickFilter = useRef<{ departmentName: string }>(null);
    const chartRef = useRef<any>(null)

    const transformFYData = (data: any[]) => {
        const currentFY = getFY(new Date().toISOString());
        const prevFY = currentFY - 1;

        const map = new Map();

        data.forEach((item) => {
            const fy = getFY(item.calMonth);

            // normalize month (ignore year → compare Apr, May…)
            const monthKey = new Date(item.calMonth).getMonth();

            if (!map.has(monthKey)) {
                map.set(monthKey, {
                    calMonth: item.calMonth,

                    previousFYProcessedDocuments: 0,
                    currentFYProcessedDocuments: 0,

                    previousFYApprovedDocuments: 0,
                    currentFYApprovedDocuments: 0,

                    previousFYPendingDocuments: 0,
                    currentFYPendingDocuments: 0,

                    previousFYRejectedDocuments: 0,
                    currentFYRejectedDocuments: 0,

                    previousFYSubmittedDocuments: 0,
                    currentFYSubmittedDocuments: 0
                });
            }

            const obj = map.get(monthKey);

            if (fy === prevFY) {
                obj.previousFYProcessedDocuments = item.processedDocuments;
                obj.previousFYApprovedDocuments = item.approvedDocuments;
                obj.previousFYPendingDocuments = item.pendingDocuments;
                obj.previousFYRejectedDocuments = item.rejectedDocuments;
                obj.previousFYSubmittedDocuments = item.submittedDocuments;
            }

            if (fy === currentFY) {
                obj.currentFYProcessedDocuments = item.processedDocuments;
                obj.currentFYApprovedDocuments = item.approvedDocuments;
                obj.currentFYPendingDocuments = item.pendingDocuments;
                obj.currentFYRejectedDocuments = item.rejectedDocuments;
                obj.currentFYSubmittedDocuments = item.submittedDocuments;
            }
        });

        const result = Array.from(map.values());
        return result;
    };


    const options: any = {
        annotations: {
            points: [{
                seriesIndex: 0,
                label: {
                    borderColor: '#775DD0',
                    offsetY: 0,
                    style: {
                        color: '#fff',
                        background: '#775DD0'
                    },
                    click: (event: any) => {
                        console.log(event.target.value)
                    }
                }
            }],
            xaxis: [
                {
                    x: getPrevFYLastMonthStart(),
                    borderColor: "#FF4560",
                    strokeDashArray: 4,
                    label: {
                        text: "Start of Current FY",
                        style: {
                            color: "#fff",
                            background: "#FF4560"
                        }
                    }
                }
            ]
        },
        chart: {
            height: 400,
            zoom: false,
            type: 'line',
            boxshadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            toolbar: {
                show: true,
                tools: {
                    download: true,
                },
            },
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
                borderRadius: 2,
                columnWidth: '60%',
                distributed: true,
                barHeight: '3px',
                horizontal: false,
            }
        },
        dataLabels: {
            enabled: true
        },
        tooltip: {
            enabled: true
        },
        legend: {
            show: true,
            position: 'top',
        },

        stroke: {
            show: true,
            width: [3, 3, 3, 3],
            curve: "smooth",
            dashArray: [4, 4, 0, 0]
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
        seriesOptions: {
            name: 'Resource Stage'
        },
        xaxis: {
            // title: {
            //     text: "Month"
            // },
            labels: {
                rotate: -45,
                formatter: (value: string) => {
                    const date = value;
                    return formatDate(date, 'monthOnly')
                }
            },
        },
        active: {
            allowMultipleDataPointsSelection: true,
        },
        // colors: [
        //     "#e98f22",
        //     "#40bd8b",
        //     "#4480ef"
        // ],
        colors: [
            "#f59e0b",
            "#16a34a",
            "#fb923c",
            "#16a34a",
            "#22c55e",

        ],

        fill: {
            opacity: 0.8
        },
    }

    // const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData' });
    // const endPointX = '/FYApprovalComparison.json'
    return (
        <div id="chart">
            <PalmyraApexChart options={options} type="line"
                endPoint={endPoint} filter={props.filter}
                height={props.height} width={'100%'} seriesOptions={[
                    { name: "Previous - Pending ", type: 'line' },
                    { name: "Previous - Processed", type: 'line' },
                    { name: "Current - Pending ", type: 'line' },
                    { name: "Current - Processed", type: 'line' }
                ]} ref={chartRef}
                preProcess={(d: any): any => transformFYData(d)}
                transformOptions={{
                    xKey: xKey, yKey: yKey, dataType: 'array',
                }}
            />
        </div>
    );

};

export { FYApprovalComparisonChart };

