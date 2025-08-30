import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import ThreeDChart from './ThreeDChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Chart.js registration ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [parsedRows, setParsedRows] = useState([]);
  const [xCol, setXCol] = useState('');
  const [yCol, setYCol] = useState('');
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [aiSummary, setAiSummary] = useState('');   // ✅ state for AI summary
  const auth = useSelector(s => s.auth);

  async function upload(e) {
    e.preventDefault();
    if (!file) return alert('Select file');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await axios.post('http://localhost:5000/api/file/upload', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + auth.token
        }
      });
      setHeaders(res.data.headers || []);
      setParsedRows(res.data.parsed || []);
      onUploaded && onUploaded();
    } catch (err) {
      alert(err.response?.data?.msg || err.message);
    }
  }

  function makeChart() {
    if (!xCol || !yCol) return alert('Select columns');

    if (chartType === 'scatter') {
      setChartData({
        datasets: [
          {
            label: yCol,
            data: parsedRows.map(r => ({ x: Number(r[xCol]) || 0, y: Number(r[yCol]) || 0 })),
            backgroundColor: "rgba(255,99,132,0.5)"
          }
        ]
      });
    } else {
      const labels = parsedRows.map(r => r[xCol]);
      const values = parsedRows.map(r => Number(r[yCol]) || 0);
      setChartData({
        labels,
        datasets: [{ label: yCol, data: values, backgroundColor: "rgba(75,192,192,0.6)" }]
      });
    }
  }

  function renderChart() {
    if (!chartData) return null;
    if (chartType === 'bar') return <Bar data={chartData} />;
    if (chartType === 'line') return <Line data={chartData} />;
    if (chartType === 'pie') return <Pie data={chartData} />;
    if (chartType === 'scatter') return <Scatter data={chartData} />;
    if (chartType === '3d') return <ThreeDChart data={parsedRows} xCol={xCol} yCol={yCol} />;
  }

  function downloadPNG() {
    const chartCanvas = document.querySelector("canvas");
    if (!chartCanvas) return;
    const link = document.createElement("a");
    link.download = "chart.png";
    link.href = chartCanvas.toDataURL("image/png");
    link.click();
  }

  async function downloadPDF() {
    const chartCanvas = document.querySelector("canvas");
    if (!chartCanvas) return;
    const canvas = await html2canvas(chartCanvas);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
    pdf.save("chart.pdf");
  }

  // ✅ AI summarization function
  async function generateSummary() {
  try {
    const res = await axios.post("http://localhost:5000/api/ai/summarize", {
      text: JSON.stringify(parsedRows.slice(0, 35)) // send as text
    }, {
      headers: { Authorization: "Bearer " + auth.token }
    });
    setAiSummary(res.data.summary);
  } catch (err) {
    console.error(err);
    alert("AI summarization failed");
  }
}


  return (
    <div className="mt-6 p-6 bg-gray-900 text-white rounded-2xl shadow-lg">
      <form onSubmit={upload} className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={e => setFile(e.target.files[0])}
          className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 
                     file:rounded-full file:border-0 
                     file:text-sm file:font-semibold
                     file:bg-teal-600 file:text-white
                     hover:file:bg-teal-700"
        />
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg font-semibold"
        >
          Upload & Parse
        </button>
      </form>

      {headers.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Choose axes & chart type</h4>
          <div className="flex flex-wrap gap-4 items-center">
            <label>
              X:
              <select value={xCol} onChange={e => setXCol(e.target.value)}
                className="ml-2 bg-gray-800 border border-gray-600 rounded px-2 py-1">
                <option value="">--select--</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </label>

            <label>
              Y:
              <select value={yCol} onChange={e => setYCol(e.target.value)}
                className="ml-2 bg-gray-800 border border-gray-600 rounded px-2 py-1">
                <option value="">--select--</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </label>

            <label>
              Chart:
              <select value={chartType} onChange={e => setChartType(e.target.value)}
                className="ml-2 bg-gray-800 border border-gray-600 rounded px-2 py-1">
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="scatter">Scatter</option>
                <option value="3d">3D</option>
              </select>
            </label>

            <button
              type="button"
              onClick={makeChart}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold"
            >
              Generate Chart
            </button>
          </div>
        </div>
      )}

      {chartData && (
        <div className="mt-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-center items-center">
            <div style={{ width: "600px", height: "400px" }}>
              {renderChart()}
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={downloadPNG}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
            >
              Download PNG
            </button>
            <button
              onClick={downloadPDF}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
            >
              Download PDF
            </button>
            <button
              onClick={generateSummary}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-semibold"
            >
              Generate AI Summary
            </button>
          </div>

          {aiSummary && (
            <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg">
              <h4 className="font-semibold mb-2">🤖 AI Summary</h4>
              <p className="text-gray-300 whitespace-pre-line">{aiSummary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
