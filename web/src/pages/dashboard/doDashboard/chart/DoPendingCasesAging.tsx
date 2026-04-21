// import { useDisclosure } from '@mantine/hooks';
import { PalmyraStoreFactory } from '@palmyralabs/palmyra-wire';
import { PalmyraApexChart } from '@palmyralabs/rt-apexchart'; 
import { IChartInput } from '../../type';
import { useCommonChartStyles } from '../../ChartTheme';

const DoPendingCasesAging = (props: IChartInput) => {
    const { title, endPoint, subText } = props;
    const { commonOptions } = useCommonChartStyles();

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
        colors: ['#22c55e', '#f59e0b', '#ef4444'],

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

    const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData/doDashDatas' });

    return (
        <div id="chart">
            <PalmyraApexChart options={options} type="radialBar"
                endPoint={endPoint} filter={props.filter}
                height={props.height} width={'100%'} storeFactory={AppStoreFactory}
                transformOptions={{ xKey: props.xKey, yKey: props.yKey, dataType: 'array' }} />
        </div>
    )
};

export { DoPendingCasesAging };
