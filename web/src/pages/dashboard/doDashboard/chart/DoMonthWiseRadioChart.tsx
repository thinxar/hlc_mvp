import { PalmyraStoreFactory } from "@palmyralabs/palmyra-wire";
import { PalmyraApexChart } from "@palmyralabs/rt-apexchart";
import { useRef } from "react";
import { IChartInput } from "../../type";
import { useCommonChartStyles } from "../../ChartTheme";
const DoMonthWiseRadioChart = (props: IChartInput) => {

    const { title, xKey, yKey, subText } = props;
    const { commonOptions } = useCommonChartStyles();
    const clickFilter = useRef<{ departmentName: string }>(null);

    const style = {
        color: "gray",
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 600
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
            enabled: true
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
                rotate: -45
            },
            title: {
                text: 'Months',
                style: style
            },
        },
        yaxis: {
            labels: {
                formatter: function (val: number) {
                    return Math.round(val) + "%";
                }
            },
            title: {
                text: 'Count',
                style: style
            },
        },
        colors: ['#f59e0b', '#22c55e', '#3b82f6'],
        active: {
            allowMultipleDataPointsSelection: true,
        },
        fill: {
            opacity: 0.8
        }
    }

    const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData/doDashDatas' });
    const endPointX = '/doMonthlyApproveRation.json'
    return (
        <div id="chart">
            <PalmyraApexChart options={options} type="area" storeFactory={AppStoreFactory}
                endPoint={endPointX} filter={props.filter}
                seriesOptions={[
                    { name: "Pending", type: 'area' },
                    { name: "Approved", type: 'area' }
                ]}
                height={props.height} width={'100%'} transformOptions={{ xKey: xKey, yKey: yKey, dataType: 'array' }}
            />
        </div>
    );

};

export { DoMonthWiseRadioChart };

