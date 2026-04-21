import { PalmyraApexChart } from "@palmyralabs/rt-apexchart";
import { useCommonChartStyles } from "../ChartTheme";
import type { IChartInput } from "../type";

const REQ_KEYS = [
    "d0_5", "d6_10", "d11_20", "d21_30", "d31_45", "d45plus"
];

const LABEL_MAP: Record<string, string> = {
    d0_5: "<5 days",
    d6_10: "6–10 days",
    d11_20: "11–20 days",
    d21_30: "21–30 days",
    d31_45: "31–45 days",
    d45plus: ">45 days"
};

const AgingAnalysisChart = (props: IChartInput) => {
    const { title, xKey, yKey, subText, endPoint } = props;
    const { commonOptions } = useCommonChartStyles();

    const transformData = (data: any): any => {
        const currData = data.slice(-1);

        const formatData = Object.entries(currData[0])
            .filter(([key]) => REQ_KEYS.includes(key))
            .map(([key, value]) => ({
                name: LABEL_MAP[key] || key,
                value: value || 0
            }));

        return formatData;
    };


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
        plotOptions: {
            bar: {
                borderRadius: 0,
                horizontal: true,
                barHeight: '80%',
                isFunnel: true,
                distributed: true
            }
        },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#f97316', '#ef4444', '#7c3aed'],
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
            type: 'bar',
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
            formatter: function (val: number, opt: any) {
                return opt.w.globals.labels[opt.dataPointIndex] + ': ' + val
            },
            dropShadow: {
                enabled: true,
            },
        }
    }

    // const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData' });
    // const endPointX = '/AgingAnalysis.json'
    return (
        <div id="chart">
            <PalmyraApexChart options={options} type="bar"
                endPoint={endPoint} filter={props.filter} preProcess={(d): any => transformData(d)}
                seriesOptions={[
                    { name: "Approvals" }
                ]}
                height={props.height} width={'100%'} transformOptions={{ xKey: xKey, yKey: yKey, dataType: 'array' }}
            />
        </div>
    );

};

export { AgingAnalysisChart };

