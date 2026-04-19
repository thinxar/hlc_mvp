import { PalmyraStoreFactory } from "@palmyralabs/palmyra-wire";
import { PalmyraApexChart } from "@palmyralabs/rt-apexchart";
import type { IChartInput } from "../type";
import { useCommonChartStyles } from "../ChartTheme";

const AgingAnalysisChart = (props: IChartInput) => {
    const { title, xKey, yKey, subText } = props;
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
        plotOptions: {
            bar: {
                borderRadius: 0,
                horizontal: true,
                barHeight: '80%',
                isFunnel: true,
                distributed: true
            }
        },
        colors: [
            '#22c55e', '#22c55e', '#f59e0b', '#f59e0b', '#ef4444', '#ef4444'
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
                return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
            },
            dropShadow: {
                enabled: true,
            },
        }
    }

    const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData' });
    const endPointX = '/AgingAnalysis.json'
    return (
        <div id="chart">
            <PalmyraApexChart options={options} type="bar" storeFactory={AppStoreFactory}
                endPoint={endPointX} filter={props.filter}
                height={props.height} width={'100%'} transformOptions={{ xKey: xKey, yKey: yKey, dataType: 'array' }}
            />
        </div>
    );

};

export { AgingAnalysisChart };

