"use client";
import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement, // นำเข้า ArcElement สำหรับกราฟวงกลม
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Dashboard.module.css";

export const dynamic = "force-dynamic";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement, // ลงทะเบียน ArcElement
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [lastData, setLastData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [attackCount, setAttackCount] = useState(null);

  async function fetchLastData() {
    try {
      const res = await fetch("/api/lastestData");
      const data = await res.json();
      setLastData(data);
      console.log("Latest Data:", data);
    } catch (error) {
      console.error("Error fetching latest data:", error);
    }
  }

  async function fetchAllData() {
    try {
      const res = await fetch("/api/alldata");
      const data = await res.json();
      setAllData(data);
      console.log("All Data:", data);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }

  async function fetchAttackCount() {
    try {
      const res = await fetch("/api/attackCount");
      const data = await res.json();
      setAttackCount(data.att);
      console.log("Attack Count:", data.att);
    } catch (error) {
      console.error("Error fetching attack count:", error);
    }
  }

  const chartData1 = lastData.length > 0 ? {
    labels: ["LDR", "VR"],
    datasets: lastData.map((dataPoint, index) => ({
      label: `Data Point ${index + 1}`,
      data: [dataPoint.ldr, dataPoint.vr],
      backgroundColor: [
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
      ],
    })),
  } : null;

  const chartData2 = lastData.length > 0 ? {
    labels: ["Temperature", "Distance"],
    datasets: lastData.map((dataPoint, index) => ({
      label: `Data Point ${index + 1}`,
      data: [dataPoint.temp, dataPoint.distance],
      backgroundColor: [
        "rgba(255, 159, 64, 0.6)",
        "rgba(255, 99, 132, 0.6)",
      ],
    })),
  } : null;

  const lineChartData1 = allData.length > 0 ? {
    labels: allData.map((dataPoint) =>
      new Date(dataPoint.date).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        dateStyle: "short",
        timeStyle: "short",
      })
    ),
    datasets: [
      {
        label: "LDR",
        data: allData.map((dataPoint) => dataPoint.ldr),
        fill: false,
        borderColor: "rgba(75, 192, 192, 0.6)",
        tension: 0.1,
      },
      {
        label: "VR",
        data: allData.map((dataPoint) => dataPoint.vr),
        fill: false,
        borderColor: "rgba(153, 102, 255, 0.6)",
        tension: 0.1,
      },
    ],
  } : null;

  const lineChartData2 = allData.length > 0 ? {
    labels: allData.map((dataPoint) =>
      new Date(dataPoint.date).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        dateStyle: "short",
        timeStyle: "short",
      })
    ),
    datasets: [
      {
        label: "Temperature",
        data: allData.map((dataPoint) => dataPoint.temp),
        fill: false,
        borderColor: "rgba(255, 159, 64, 0.6)",
        tension: 0.1,
      },
      {
        label: "Distance",
        data: allData.map((dataPoint) => dataPoint.distance),
        fill: false,
        borderColor: "rgba(255, 99, 132, 0.6)",
        tension: 0.1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Latest Sensor Data Visualization",
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sensor Data Trends Over Time",
      },
    },
  };

  function downloadCSV(data, filename) {
    const csvData = data.map((row) =>
      Object.values(row).join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + csvData.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    fetchLastData();
    fetchAllData();
    fetchAttackCount();

    const intervalId = setInterval(() => {
      fetchLastData();
      fetchAllData();
      fetchAttackCount();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`${styles.dashboard} container`}>
      <h1 className={`${styles.heading} text-center my-4`}>
        Home
      </h1>
      <ul className="nav nav-tabs" id="chartTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="ldr-vr-tab"
            data-bs-toggle="tab"
            data-bs-target="#ldr-vr"
            type="button"
            role="tab"
            aria-controls="ldr-vr"
            aria-selected="true"
          >
            LDR and VR
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="temp-distance-tab"
            data-bs-toggle="tab"
            data-bs-target="#temp-distance"
            type="button"
            role="tab"
            aria-controls="temp-distance"
            aria-selected="false"
          >
            Temperature and Distance
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="trend-ldr-vr-tab"
            data-bs-toggle="tab"
            data-bs-target="#trend-ldr-vr"
            type="button"
            role="tab"
            aria-controls="trend-ldr-vr"
            aria-selected="false"
          >
            LDR and VR Trends
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="trend-temp-distance-tab"
            data-bs-toggle="tab"
            data-bs-target="#trend-temp-distance"
            type="button"
            role="tab"
            aria-controls="trend-temp-distance"
            aria-selected="false"
          >
            Temperature and Distance Trends
          </button>
        </li>
      </ul>
      <div className="tab-content" id="chartTabsContent">
        <div
          className="tab-pane fade show active"
          id="ldr-vr"
          role="tabpanel"
          aria-labelledby="ldr-vr-tab"
        >
          {lastData.length > 0 && chartData1 ? (
            <div className={styles.chartContainer}>
              <h2>LDR and VR</h2>
              <Pie data={chartData1} options={chartOptions} />
            </div>
          ) : (
            <p>No data available for LDR and VR chart</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="temp-distance"
          role="tabpanel"
          aria-labelledby="temp-distance-tab"
        >
          {lastData.length > 0 && chartData2 ? (
            <div className={styles.chartContainer}>
              <h2>Temperature and Distance</h2>
              <Pie data={chartData2} options={chartOptions} />
            </div>
          ) : (
            <p>No data available for Temperature and Distance chart</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="trend-ldr-vr"
          role="tabpanel"
          aria-labelledby="trend-ldr-vr-tab"
        >
          {allData.length > 0 && lineChartData1 ? (
            <div className={styles.chartContainer}>
              <h2>LDR and VR Trends Over Time</h2>
              <Line data={lineChartData1} options={lineChartOptions} />
              <button
                onClick={() =>
                  downloadCSV(allData, "ldr_vr_trends.csv")
                }
                className="btn btn-primary mt-3"
              >
                Download LDR and VR Trends Data
              </button>
            </div>
          ) : (
            <p>No data available for LDR and VR trends</p>
          )}
        </div>
        <div
          className="tab-pane fade"
          id="trend-temp-distance"
          role="tabpanel"
          aria-labelledby="trend-temp-distance-tab"
        >
          {allData.length > 0 && lineChartData2 ? (
            <div className={styles.chartContainer}>
              <h2>Temperature and Distance Trends Over Time</h2>
              <Line data={lineChartData2} options={lineChartOptions} />
              <button
                onClick={() =>
                  downloadCSV(allData, "temp_distance_trends.csv")
                }
                className="btn btn-primary mt-3"
              >
                Download Temperature and Distance Trends Data
              </button>
            </div>
          ) : (
            <p>No data available for Temperature and Distance trends</p>
          )}
        </div>
      </div>
    </div>
  );
}