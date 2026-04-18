import { PalmyraApexChart } from "@palmyralabs/rt-apexchart";
import { useCommonChartStyles } from "./ChartTheme";
import type { IChartInput } from "./type";

const DoCodePolicyChart = (props: IChartInput) => {
    const { title, xKey, yKey, subText, endPoint } = props;
    const { commonOptions } = useCommonChartStyles();

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
            ...commonOptions.approvalColors
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
        colors: [
            '#6366f1', '#f59e0b', '#10b981',
            '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#ef4444',
        ],
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
        dataLabels: {
            enabled: true,
            formatter: function (_val: number, opts: any) {
                const actualValue = opts.w.globals.series[opts.seriesIndex];
                return actualValue;
            }
        }

    }

    return (
        <div id="chart">
            <PalmyraApexChart options={options} type="donut"
                endPoint={endPoint} filter={props.filter}
                height={props.height} width={'100%'}
                transformOptions={{ xKey: xKey, yKey: yKey, dataType: 'array' }}
            />
        </div>
    );

};

export { DoCodePolicyChart };

