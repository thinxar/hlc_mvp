// import { useDisclosure } from '@mantine/hooks';
import { PalmyraApexChart } from '@palmyralabs/rt-apexchart';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { IChartInput } from '../../type';
import { PalmyraStoreFactory } from '@palmyralabs/palmyra-wire';

dayjs.extend(customParseFormat);

const DoBranchPerformanceChart = (props: IChartInput) => {
    const { endPoint, title, xKey, yKey, filter } = props;
    const colors = ['#ff8c00', '#3B82F6'];
    const style = {
        color: "gray",
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 600
    }

    const options: any = {
        chart: {
            type: 'bar',
            stacked: true,
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
                enabled: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 2,
                horizontal: false,
                rangeBarOverlap: false,
                columnWidth: '50%',
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
            colors: colors
        },
        title: {
            text: title,
        },
        xaxis: {
            title: {
                text: 'Branches',
                style: style
            },
            labels: {
                rotate: -45,
                style: {
                    fontSize: '12px'
                },
                trim: true,
                hideOverlappingLabels: true
            }
        },
        yaxis: {
            title: {
                text: 'Count',
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
        fill: {
            opacity: 0.7
        },
        colors: colors
    };
    const AppStoreFactory = new PalmyraStoreFactory({ baseUrl: '/data/chartData/doDashDatas' });

    return <> <PalmyraApexChart options={options} type="bar" storeFactory={AppStoreFactory}
        endPoint={endPoint} filter={filter} height={'400'} width={'100%'}
        seriesOptions={[
            { name: 'Pending' },
            { name: 'In-Progress' },
            { name: 'Approved' }
        ]}
        transformOptions={{ xKey: xKey, yKey: yKey, dataType: 'array' }} />
    </>
};

export { DoBranchPerformanceChart };
