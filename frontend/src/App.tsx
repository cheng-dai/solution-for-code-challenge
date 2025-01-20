import { useEffect, useState } from "react";
import "chart.js/auto";
import { Chart as ChartJS } from "chart.js";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import { fetchFundingRounds } from "./api";
import { ChartOptions } from "chart.js";
const App = () => {
  const [fundingData, setFundingData] = useState<
    { name: string; amount: number; date: Date }[]
  >([]);

  useEffect(() => {
    ChartJS.register(zoomPlugin);
    const loadFundingData = async () => {
      try {
        const data = await fetchFundingRounds();
        setFundingData(data);
      } catch (error) {
        console.error("Error fetching funding rounds:", error);
      }
    };

    loadFundingData();
  }, []);
  // Top 15 Funding Rounds Chart
  // chart options
  const topChartOptions: ChartOptions = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Top 15 Funding Rounds",
        font: {
          size: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataset = context.dataset;
            const dataIndex = context.dataIndex;
            const value = dataset.data[dataIndex];
            // There currently is a bug in Prisma, DateTime value need to be transformed to a Date object before pass in as string. https://github.com/prisma/prisma/issues/9516
            const date = new Date(TopFundingData[dataIndex].date);
            return [`Amount: ${value}`, `Date: ${date.toLocaleDateString()}`];
          },
        },
      },
    },
  };
  // chart one data
  const TopFundingData = [...fundingData]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 15);
  const topChartData = {
    labels: TopFundingData.map(item => item.name),
    datasets: [
      {
        label: "Funding Amounts",
        data: TopFundingData.map(item => item.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Timeline of All Funding Rounds Chart
  // chart options
  const timelineChartOptions: ChartOptions = {
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
        },
      },
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "All Funding Rounds",
        font: {
          size: 20,
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            const dataIndex = context[0].dataIndex;
            return fundingData[dataIndex].name;
          },
          label: function (context) {
            const dataset = context.dataset;
            const dataIndex = context.dataIndex;
            const value = dataset.data[dataIndex];
            const date = new Date(fundingData[dataIndex].date);
            return [`Amount: ${value}`, `Date: ${date.toLocaleDateString()}`];
          },
        },
      },
    },
  };

  // chart data
  const timelineChartData = {
    labels: fundingData.map(item => item.date),
    datasets: [
      {
        label: "Funding Amountsss",
        data: fundingData.map(item => item.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "90vw", margin: "10px 24px", textAlign: "start" }}>
      <Chart type="bar" options={topChartOptions} data={topChartData} />

      <Chart
        type="bar"
        options={timelineChartOptions}
        data={timelineChartData}
      />
    </div>
  );
};

export default App;
