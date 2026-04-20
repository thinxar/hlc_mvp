import { PalmyraApexChart } from "@palmyralabs/rt-apexchart";
import { useRef } from "react";
import { formatDate } from "utils/FormateDate";
import { useCommonChartStyles } from "../ChartTheme";
import type { IChartInput } from "../type";

const FYApprovalComparisonChart = (props: IChartInput) => {
    const { title, xKey, yKey, subText, endPoint } = props;
    const { commonOptions } = useCommonChartStyles();
    const clickFilter = useRef<{ departmentName: string }>(null);

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
                    x: "Mar 2026",
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
            width: [3, 3, 2],
            curve: "smooth",
            dashArray: [4, 0, 2],
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
                    return formatDate(date, 'month')
                }
            },
        },
        active: {
            allowMultipleDataPointsSelection: true,
        },
        colors: [
            "#a3a29f",
            "#40bd8b",
            "#4480ef"
        ],
        fill: {
            opacity: 0.8
        },
    }

    // const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData' });
    // const endPointX = '/FYApprovalComparison.json'
    console.log(props.filter);
    
    return (
        <div id="chart">
            <PalmyraApexChart options={options} type="line"
                endPoint={endPoint} filter={props.filter}
                height={props.height} width={'100%'} seriesOptions={[
                    { name: "Previous FY ", type: 'line' },
                    { name: "Current FY", type: 'line' }
                ]}
                transformOptions={{
                    xKey: xKey, yKey: yKey, dataType: 'array',
                }}
            />
        </div>
    );

};

export { FYApprovalComparisonChart };

