import Chart from "react-apexcharts";
import { useCommonChartStyles } from "../../ChartTheme";
import { IChartInput } from "../../type";
import { useEffect, useMemo, useState } from "react";
import { useFormstore } from "wire/StoreFactory";

const COLORS = [
    "#34D399", // green
    "#60A5FA", // blue
    "#F59E0B", // amber
    "#F472B6", // pink
    "#A78BFA", // violet
    "#22D3EE", // cyan
    "#FB7185", // rose
    "#4ADE80", // light green
    "#818CF8", // indigo
    "#FBBF24"  // yellow
];


let colorIndex = 0;

const getSoftColor = () => {
    const color = COLORS[colorIndex % COLORS.length];
    colorIndex++;
    return color;
};

const BubbleChart = (props: IChartInput) => {
    const { title, subText, endPoint, filter } = props;
    const { commonOptions } = useCommonChartStyles();

    const [data, setData] = useState<any>([]);

    const buildQueryParams = (filter: any) => {
        const params = new URLSearchParams();

        Object.entries?.(filter)?.forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, String(value));
            }
        });

        return params.toString();
    };

    const query = useMemo(() => buildQueryParams(filter), [filter]);

    useEffect(() => {

        const query = buildQueryParams(filter);
        const endpoint = query ? `${endPoint}?${query}` : endPoint;
        useFormstore(endpoint, {}, '').get({}).then((d) => {
            if (d)
                setData(d)
        })
    }, [query])

    const generateBubbleData = (data: any[]) => {
        return data?.map((item) => ({
            name: item.branchName,
            x: item.pendingDocuments,
            y: item.processedDocuments,
            z: item.submittedDocuments,
            fillColor: getSoftColor(),
        }));
    };

    const bubbleData = generateBubbleData(data);

    const series = [
        {
            name: "Performance",
            data: bubbleData
        }
    ];

    const options: any = {
        chart: {
            type: "bubble",
            height: 400,
            zoom: false,
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
                }
            }
        },
        plotOptions: {
            bubble: {
                distributed: true
            }
        },

        dataLabels: {
            enabled: false
        },
        title: {
            text: title,
            ...commonOptions.title
        },
        subtitle: {
            text: subText ? subText : '',
            align: 'left',
            ...commonOptions.subtitle
        },
        stroke: {
            width: 1
        },
        // markers: {
        //     strokeColors: undefined 
        // },
        fill: {
            opacity: 0.3
        },
        xaxis: {
            title: {
                text: "Pending Count"
            },
        },

        yaxis: {
            title: {
                text: "Approved Count"
            }
        },

        tooltip: {
            custom: ({ seriesIndex, dataPointIndex, w }: any) => {
                const point = w.config.series[seriesIndex].data[dataPointIndex];

                return `
          <div style="padding:8px">
            <b>${point.name}</b><br/>
            Pending: ${point.x}<br/>
            Approved: ${point.y}
          </div>
        `;
            }
        }
    };

    return (
        <div>
            <Chart options={options} series={series} type="bubble" height={props.height} key={JSON.stringify(props.filter)}/>
        </div>
    );
};

export default BubbleChart;
