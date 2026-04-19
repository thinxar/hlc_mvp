import { PalmyraStoreFactory } from "@palmyralabs/palmyra-wire";
import { PalmyraApexChart } from "@palmyralabs/rt-apexchart";
import type { IChartInput } from "../type";
import { useCommonChartStyles } from "../ChartTheme";

const TodayCaseBreakdownChart = (props: IChartInput) => {
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
        colors: [
            '#f59e0b', '#22c55e', '#ef4444'
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
        dataLabels: {
            formatter: function (val: number) {
                return Math.round(val) + "%";
            }
        }
    }

    const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData' });
    const endPointX = '/TodayCaseBreakdown.json'
    return (
        <div id="chart">
            <PalmyraApexChart options={options} type="radar" storeFactory={AppStoreFactory}
                endPoint={endPointX} filter={props.filter}
                seriesOptions={[
                    { name: "Pending" },
                    { name: "Approved" },
                    { name: "Rejected" }
                ]}
                height={props.height} width={'100%'} transformOptions={{ xKey: xKey, yKey: yKey, dataType: 'array' }}
            />
        </div>
    );

};

export { TodayCaseBreakdownChart };

