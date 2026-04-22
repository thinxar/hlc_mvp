// import { useDisclosure } from '@mantine/hooks';
import { PalmyraApexChart } from '@palmyralabs/rt-apexchart';
import { useCommonChartStyles } from '../../ChartTheme';
import { IChartInput } from '../../type';

const TopBranchApprovalRateChart = (props: IChartInput) => {
    const { title, xKey, yKey, filter, endPoint, subText, height } = props;
    const { commonOptions } = useCommonChartStyles();

    const options: any = {
        chart: {
            type: 'bar',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
                }
            },
            zoom: {
                enabled: true
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 2,
                horizontal: true,
                rangeBarOverlap: false,
                columnWidth: '50%',
                barHeight: '70%',
                colors: {
                    ranges: [
                        {
                            from: 0,
                            to: 0,
                            color: '#ffff00'
                        }
                    ]
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: number) {
                return val === 0 ? '' : val + '%';
            }
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#22c55e', '#f59e0b',]
        },
        title: {
            text: title,
        },
        subtitle: {
            text: subText ? subText : '',
            align: 'left',
            ...commonOptions.subtitle
        },
        xaxis: {
            labels: {
                rotate: -45,
                style: {
                    fontSize: '12px'
                },
                trim: true,
                hideOverlappingLabels: true
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
        legend: {
            position: 'top'
        },
        grid: {
            padding: {
                left: 50,
                right: 20
            }
        },
        colors: ['#22c55e', '#f59e0b',]
    };

    // const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData/doDashDatas' });

    return <> <PalmyraApexChart options={options} type="bar" key={JSON.stringify(props.filter)}
        endPoint={endPoint} filter={filter} height={height} width={'100%'}
        seriesOptions={[
            { name: 'Processed' }
        ]}
        transformOptions={{ xKey: xKey, yKey: yKey, dataType: 'array' }} />
    </>
};

export { TopBranchApprovalRateChart };

