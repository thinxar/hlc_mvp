// import { useDisclosure } from '@mantine/hooks';
import { PalmyraApexChart } from '@palmyralabs/rt-apexchart';
import { useCommonChartStyles } from '../../ChartTheme';
import { IChartInput } from '../../type';

// const BAND_KEYS = [
//     "d0_5", "d6_10", "d11_20", "d21_30", "d31_45", "d45plus"
// ];

const DoPendingCasesAging = (props: IChartInput) => {
    const { title, endPoint, subText } = props;
    const { commonOptions } = useCommonChartStyles();

    const transformData = (data: any) => {
        if (!data) return [];

        const mapping: Record<string, string> = {
            d0_5: "<5 days",
            d6_10: "6–10 days",
            d11_20: "11–20 days",
            d21_30: "21–30 days",
            d31_45: "31–45 days",
            d45plus: ">45 days"
        };

        const result = Object.entries(mapping).map(([key, label]) => ({
            name: label,
            value: Number(data[key] || 0)
        }));

        return result;
    };


    const options: any = {
        title: {
            text: title,
            style: {
                fontSize: '18px',
                fontWeight: 600
            }
        },
        subtitle: {
            text: subText ? subText : '',
            align: 'left',
            ...commonOptions.subtitle
        },
        chart: {
            sparkline: {
                enabled: false
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 270,
                hollow: {
                    size: '40%',
                    background: 'transparent',
                },
                track: {
                    background: '#f2f2f2',
                    strokeWidth: '100%',
                },
                dataLabels: {
                    name: {
                        fontSize: '14px',
                        offsetY: 10
                    },
                    value: {
                        fontSize: '20px',
                        fontWeight: 600,
                        formatter: (val: any) => `${val}`
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        formatter: function (w: any) {
                            const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                            return `${total}`;
                        }
                    }
                }
            }
        },
        // colors: ['#22c55e', '#f59e0b', '#ef4444'],
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#f97316', '#ef4444', '#7c3aed'],
        legend: {
            show: true,
            position: 'top',
            fontSize: '13px',
            labels: {
                colors: '#555'
            },
            markers: {
                width: 10,
                height: 10,
                radius: 12
            },
            itemMargin: {
                horizontal: 10,
                vertical: 5
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
        stroke: {
            lineCap: 'round'
        },

        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    return (
        <div id="chart">
            <PalmyraApexChart options={options} type="radialBar"
                endPoint={endPoint} filter={props.filter}
                height={props.height} width={'100%'}
                seriesOptions={[
                    { name: "<5 days" },
                    { name: "6-10 days" },
                    { name: "11-20 days" },
                    { name: "21-30 days" },
                    { name: "31-45 days" },
                    { name: ">45 days" }
                ]} preProcess={(d: any): any => transformData(d)} key={JSON.stringify(props.filter)}
                transformOptions={{ xKey: props.xKey, yKey: props.yKey, dataType: 'array' }} />
        </div>
    )
};

export { DoPendingCasesAging };

