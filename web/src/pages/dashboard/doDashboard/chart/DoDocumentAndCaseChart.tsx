// import { useDisclosure } from '@mantine/hooks';
import { PalmyraStoreFactory } from '@palmyralabs/palmyra-wire';
import { PalmyraApexChart } from '@palmyralabs/rt-apexchart';
import { useCommonChartStyles } from '../../ChartTheme';
import { IChartInput } from '../../type';

const DoDocumentAndCaseChart = (props: IChartInput) => {
    const { title, xKey, yKey, filter, endPoint, subText, height } = props;
    const { commonOptions } = useCommonChartStyles();

    const style = {
        color: "gray",
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 600
    }

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
                horizontal: false,
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
                return val === 0 ? '' : val;
            }
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#2989d6', '#00a387'],

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
            },
            title: {
                text: 'Branches',
                style: style
            },
        },
        yaxis: {
            min: 0,
            title: {
                text: 'count',
                style: style
            },
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
        colors: ['#2989d6', '#00a387'],

    };

    const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData/doDashDatas' });

    return <> <PalmyraApexChart options={options} type="bar"
        endPoint={endPoint} filter={filter} height={height} width={'100%'} storeFactory={AppStoreFactory}
        seriesOptions={[
            { name: 'Case' },
            { name: 'Documents' },
        ]}
        transformOptions={{ xKey: xKey, yKey: yKey, dataType: 'array' }} />
    </>
};

export { DoDocumentAndCaseChart };
