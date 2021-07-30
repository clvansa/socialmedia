import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import numeral from "numeral";

const plugins = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const LineGraph = ({ casesType = "cases" }) => {
  const [data, setDate] = useState({});

  const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  const backgroundColor =
    casesType === "recovered"
      ? "rgba(144, 238, 144, 0.596)"
      : "rgba(204, 16, 52, 0.5)";

  const borderColor = casesType === "recovered" ? "#40f340" : "#CC1034";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://disease.sh/v3/covid-19/historical/all?lastdays=30"
        );
        const chartDate = await buildChartData(res.data, "cases");
        setDate(chartDate);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [casesType]);

  return (
    <div style={{ height: "fit-content" }}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                data: data,
                fill: true,
              },
            ],
          }}
          options={{ plugins }}
        />
      )}
    </div>
  );
};

export default LineGraph;
