import { PalmyraApexChart } from "@palmyralabs/rt-apexchart";
import { useCommonChartStyles } from "../ChartTheme";
import type { IChartInput } from "../type";

const TodayCaseReportChart = (props: IChartInput) => {
    const { title, xKey, yKey, subText, endPoint } = props;
    const { commonOptions } = useCommonChartStyles();

    const transformSnapshots = (data: any): any => {
        const currData = data.slice(-1);
        const requiredKeys = ["submittedDocuments", "pendingDocuments", "processedDocuments"];
        const order = ["Submitted", "Pending", "Processed"];
        const formatData = Object.entries(currData[0])
            .filter(([key]) => requiredKeys.includes(key))
            .map(([key, value]) => ({
                name: key === "pendingDocuments"
                    ? "Pending"
                    : key === "processedDocuments"
                        ? "Processed"
                        : "Submitted",
                value: value || 0
            }))
            .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
        return formatData;
    }

    const options: any = {
        ...commonOptions,
        annotations: {
            points: [{
                seriesIndex: 0,
                label: {
                    borderColor: '#775DD0',
                    offsetY: 0,
                    style: {
                        color: '#fff',
                        background: '#775DD0',
                        cssClass: 'apexcharts-point-annotation-label'
                    },

                }
            }]
        },
        colors: [
            '#3b82f6', '#f59e0b', '#22c55e', '#ef4444'
        ],
        legend: {
            show: true,
            position: "top",
            onItemClick: {
                toggleDataSeries: false
            }
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
        chart: {
            events: {
                dataPointSelection: function (_event: any, _chartContext: any, config: any) {
                    const dataPointIndex = config.dataPointIndex;
                    // const seriesValue = _chartContext.w.config.labels[dataPointIndex]

                    if (dataPointIndex != null) {
                        // open();
                    }
                }
            }
        },
        states: {
            active: {
                filter: {
                    type: 'none',
                    value: 0
                }
            },
            hover: {
                filter: {
                    type: 'none',
                    value: 0
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (_val: number, opts: any) {
                const actualValue = opts.w.globals.series[opts.seriesIndex];
                return actualValue;
            }
        }
    }

    // const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData' });
    // const endPointX = '/TodayCaseReportChart.json'
    return (
        <div id="chart">
            <PalmyraApexChart options={options} type="donut"
                endPoint={endPoint} filter={props.filter} preProcess={(d): any => transformSnapshots(d)}
                height={props.height} width={'100%'} transformOptions={{ xKey: xKey, yKey: yKey, dataType: 'array' }}
            />
        </div>
    );

};

export { TodayCaseReportChart };

