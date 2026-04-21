import { PalmyraStoreFactory } from "@palmyralabs/palmyra-wire";
import { PalmyraApexChart } from "@palmyralabs/rt-apexchart";
import { IChartInput } from '../../type';
import { useCommonChartStyles } from "../../ChartTheme";
import { useRef } from "react";

const TopBranchAppRateChart = (props: IChartInput) => {
    const { endPoint, title, xKey, yKey, filter, subText } = props;
    const { commonOptions } = useCommonChartStyles();
    const clickFilter = useRef<{ status: string }>(null);

    const colors = ['#f59e0b', '#22c55e']

    const options: any = {
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 90,
                offsetY: 10
            }
        },
        chart: {

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
                        const dataPointIndex = config.dataPointIndex;
                        const label = chartContext?.w?.config.labels[dataPointIndex];
                        clickFilter.current = label;
                    }
                }
            },
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (_val: number, opts: any) {
                const seriesIndex = opts?.seriesIndex;
                return opts.w.globals?.series[seriesIndex];
            }
        },
        stroke: {
            curve: 'smooth',
            width: 0.6,
            colors: colors
            // colors: colors
        },
        // fill: {
        //     type: 'gradient',
        //     opacity: 0.5
        // },
        title: {
            text: title
        },
        subtitle: {
            text: subText ? subText : '',
            align: 'left',
            ...commonOptions.subtitle
        },
        legend: {
            show: true,
            position: 'top',
            formatter: (val: any) => `${val}`
        },
        tooltip: {
            y: {
                formatter: (val: any) => `${val}`
            }
        },
        noData: {
            text: 'No Data Available',
            align: 'center',
            verticalAlign: 'middle',
            offsetX: 0,
            offsetY: 0,
            style: {
                color: 'rgba(var(--dark-color-rgb),0.5)',
                fontSize: '22px',
                fontFamily: undefined
            }
        },
        responsive: [{
            breakpoint: 0,
            options: {
                grid: {
                    padding: {
                        bottom: 0
                    }
                },
                legend: {
                    position: 'top'
                }
            }
        }],
        fill: {
            opacity: 0.8
        }, grid: {
            padding: {
                bottom: -200
            }
        },
        colors: colors
    };
    const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData/doDashDatas/' });

    return (
        <div id="chart">
            <PalmyraApexChart
                type="donut" options={options} endPoint={endPoint}
                filter={filter} height={props.height} width={'100%'}
                transformOptions={{ xKey: xKey, yKey: yKey, dataType: 'array' }}
                storeFactory={AppStoreFactory}
            />
        </div>
    );
}

export { TopBranchAppRateChart };
