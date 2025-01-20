import { useEffect, useState } from "react";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { fetchFundingRounds } from "./api";

const App = () => {
  const [fundingData, setFundingData] = useState<
    { name: string; amount: number }[]
  >([]);

  useEffect(() => {
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

  const chartData = {
    labels: fundingData.map(item => item.name),
    datasets: [
      {
        label: "Funding Amounts",
        data: fundingData.map(item => item.amount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "80%", margin: "0 auto", textAlign: "start" }}>
      <h1>Assignment</h1>
      <p>Your task is to show two charts on this page:</p>
      <p>
        The first chart should show the biggest 15 funding rounds from the DB
        sorted by amount, showing the round name and date (hint: date
        information exists in the DB but you may need to adjust prisma schema to
        use it).
      </p>
      <p>
        The second chart should show the timeline of all funding rounds from the
        DB using the date for x-axis and the amount for y-axis.
      </p>
      <p>
        The database for this assignment is an SQLite db that you can find in:
        <pre>backend/prisma/dev.db</pre>
      </p>

      <h1>Example Chart</h1>
      <p>This is a scaffold to get you started.</p>
      <Chart type="bar" data={chartData} />
    </div>
  );
};

export default App;
