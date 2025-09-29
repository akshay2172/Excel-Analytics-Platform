import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import ThreeDChart from './ThreeDChart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function UploadForm({ onUploaded, onChartSave, onInsightSave }) {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [parsedRows, setParsedRows] = useState([]);
  const [xCol, setXCol] = useState('');
  const [yCol, setYCol] = useState('');
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [aiSummary, setAiSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isSavingChart, setIsSavingChart] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const auth = useSelector(s => s.auth);

  async function upload(e) {
    e.preventDefault();
    if (!file) return alert('Select file');
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  function makeChart() {
    if (!xCol || !yCol) return alert('Select columns');

    
    let data;
    if (chartType === 'scatter') {
      data = {
        datasets: [
          {
            label: `${yCol} vs ${xCol}`,
            data: parsedRows.map(r => ({ 
              x: Number(r[xCol]) || 0, 
              y: Number(r[yCol]) || 0 
            })),
            backgroundColor: "rgba(13, 148, 136, 0.6)",
            borderColor: "rgba(13, 148, 136, 1)",
            borderWidth: 1
          }
        ]
      };
    } else {
      const labels = parsedRows.map(r => r[xCol]);
      const values = parsedRows.map(r => Number(r[yCol]) || 0);
      
      data = {
        labels,
        datasets: [{
          label: yCol,
          data: values,
          backgroundColor: [
            'rgba(13, 148, 136, 0.8)',
            'rgba(101, 163, 13, 0.8)',
            'rgba(234, 88, 12, 0.8)',
            'rgba(200, 50, 93, 0.8)',
            'rgba(126, 34, 206, 0.8)',
            'rgba(20, 90, 180, 0.8)',
          ],
          borderColor: [
            'rgba(13, 148, 136, 1)',
            'rgba(101, 163, 13, 1)',
            'rgba(234, 88, 12, 1)',
            'rgba(200, 50, 93, 1)',
            'rgba(126, 34, 206, 1)',
            'rgba(20, 90, 180, 1)',
          ],
          borderWidth: 1
        }]
      };
    }

    
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${yCol} by ${xCol}`,
          font: {
            size: 16
          }
        },
      },
      maintainAspectRatio: false
    };

    setChartData({ data, options });
    setSaveSuccess(false); 
  }

  function renderChart() {
    if (!chartData) return null;
    if (chartType === 'bar') return <Bar data={chartData.data} options={chartData.options} />;
    if (chartType === 'line') return <Line data={chartData.data} options={chartData.options} />;
    if (chartType === 'pie') return <Pie data={chartData.data} options={chartData.options} />;
    if (chartType === 'scatter') return <Scatter data={chartData.data} options={chartData.options} />;
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
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("chart.pdf");
  }

  async function generateSummary() {
    if (!parsedRows.length) return;
    
    setIsGeneratingSummary(true);
    try {
      
      const textData = parsedRows.slice(0, 20).map(row => 
        Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(', ')
      ).join('; ');
      
      const res = await axios.post("http://localhost:5000/api/ai/summarize", {
        text: textData
      }, {
        headers: { Authorization: "Bearer " + auth.token }
      });
      
      setAiSummary(res.data.summary);
      
      
      if (onInsightSave) {
        onInsightSave({
          summary: res.data.summary
        });
      }
      
    } catch (err) {
      console.error(err);
      alert("AI summarization failed");
    } finally {
      setIsGeneratingSummary(false);
    }
  }

  function saveChart() {
    if (!chartData || !xCol || !yCol) return;
    
    setIsSavingChart(true);
    
   
    setTimeout(() => {
      if (onChartSave) {
        onChartSave({
          xAxis: xCol,
          yAxis: yCol,
          chartType: chartType,
          chartData: chartData,
          createdAt: new Date().toISOString()
        });
      }
      
      setIsSavingChart(false);
      setSaveSuccess(true);
      
      
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Excel File</h2>
      
      <form onSubmit={upload} className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="block flex-1">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-green-400 transition-colors duration-300 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <i className="fas fa-file-excel text-green-600 text-xl"></i>
              </div>
              <p className="text-gray-600 mb-1">
                {file ? file.name : "Click to select or drag & drop your Excel file"}
              </p>
              <p className="text-sm text-gray-400">Supports .xlsx, .xls files</p>
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={e => setFile(e.target.files[0])}
                className="hidden"
              />
            </div>
          </label>
          
          <button
            type="submit"
            disabled={isLoading || !file}
            className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg font-semibold text-white disabled:bg-gray-400 transition transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt mr-2"></i>
                Upload & Parse
              </>
            )}
          </button>
        </div>
      </form>

      {headers.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Chart Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">X-Axis</label>
              <select 
                value={xCol} 
                onChange={e => setXCol(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                <option value="">Select X-Axis</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Y-Axis</label>
              <select 
                value={yCol} 
                onChange={e => setYCol(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                <option value="">Select Y-Axis</option>
                {headers.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Chart Type</label>
              <select 
                value={chartType} 
                onChange={e => setChartType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="scatter">Scatter Plot</option>
                <option value="3d">3D Chart</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={makeChart}
            disabled={!xCol || !yCol}
            className="mt-4 bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg font-semibold text-white disabled:bg-gray-400 transition transform hover:scale-105"
          >
            <i className="fas fa-chart-bar mr-2"></i>
            Generate Chart
          </button>
        </div>
      )}

      {chartData && (
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="h-96">
              {renderChart()}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadPNG}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-white transition transform hover:scale-105"
            >
              <i className="fas fa-download mr-2"></i> Download PNG
            </button>
            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-white transition transform hover:scale-105"
            >
              <i className="fas fa-file-pdf mr-2"></i> Download PDF
            </button>
            <button
              onClick={saveChart}
              disabled={isSavingChart || saveSuccess}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold text-white disabled:bg-indigo-400 transition transform hover:scale-105"
            >
              {isSavingChart ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <i className="fas fa-check mr-2"></i> Saved!
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i> Save Chart
                </>
              )}
            </button>
            <button
              onClick={generateSummary}
              disabled={isGeneratingSummary}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-semibold text-white disabled:bg-purple-400 transition transform hover:scale-105"
            >
              {isGeneratingSummary ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Generating Summary...
                </>
              ) : (
                <>
                  <i className="fas fa-brain mr-2"></i> AI Summary
                </>
              )}
            </button>
          </div>

          {saveSuccess && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Chart saved successfully! </strong>
              <span className="block sm:inline">You can now view it in the "My Charts" section.</span>
            </div>
          )}
        </div>
      )}

      {aiSummary && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
            <i className="fas fa-brain mr-2"></i> AI Summary
          </h3>
          <p className="text-green-700">{aiSummary}</p>
        </div>
      )}
    </div>
  );
}