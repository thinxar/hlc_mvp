import Chart from "react-apexcharts";

const BubbleChart = () => {

    const generateBubbleData = (count = 20) => {
        const branches = [
            "BHOPAL CBO-3", "BHOPAL CBO (CAB)", "SHAJAPUR", "BIAORA", "BHOPAL CBO-1",
            "ITARSI", "BHOPAL CBO-2", "SEHORE", "VIDISHA", "HARDA",
            "Karur", "Cuddalore", "Kanchipuram", "Thanjavur", "Nagapattinam",
            "HOSHANGABAD", "UMARIA", "BETUL", "PANNA", "ITARSI",
            "Perambalur", "RAISEN", "BHOPAL (BHEL) CBO", "BAIRAGARH",
            "BARELI", "BHOPAL CBO-4", "GANJ BASODA", "SHUJALPUR", "PIPARIYA",
            "BETUL", "PATHAKHEDA", "TIKAMGARH", "PANNA", "SATNA-II",
            "SHAHDOL", "AMBIKAPUR", "UMARIA", "CHIRIMIRI", "SHAHDOL (CAB)"
        ];

        const size = Math.min(count, 40);

        return Array.from({ length: size }, (_, i) => {
            const pending = Math.floor(Math.random() * 100) + 20;
            const approved = Math.floor(Math.random() * pending);

            return {
                name: branches[i],
                x: pending,
                y: approved,
                z: Math.min(20, 40)
            };
        });
    };

    const bubbleData = generateBubbleData(30);

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

        dataLabels: {
            enabled: false
        },

        xaxis: {
            title: {
                text: "Pending Count"
            }
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
            <span className="font-semibold">Branch Performance</span>
            <Chart options={options} series={series} type="bubble" height={400} />
        </div>
    );
};

export default BubbleChart;
