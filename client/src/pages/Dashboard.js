import React, { useState, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import "../index.css";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

export default function Dashboard() {
  const auth = useSelector(s => s.auth);
  const [uploads, setUploads] = useState([]);
  const [charts, setCharts] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [selectedInsight, setSelectedInsight] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!auth.token) return;

    setIsLoading(true);

    fetchUploads();


    const savedCharts = JSON.parse(localStorage.getItem('userCharts') || '[]');
    const savedInsights = JSON.parse(localStorage.getItem('userInsights') || '[]');

    setCharts(savedCharts);
    setAiInsights(savedInsights);
    setIsLoading(false);
  }, [auth.token]);

  const fetchUploads = () => {
    axios
      .get('http://localhost:5000/api/file', {
        headers: { Authorization: 'Bearer ' + auth.token },
      })
      .then((r) => {
        setUploads(r.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const refreshUploads = () => {
    fetchUploads();
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setSelectedChart(null);
    setSelectedInsight(null);
  };

  const deleteFile = (fileId) => {
    axios
      .delete(`http://localhost:5000/api/file/${fileId}`, {
        headers: { Authorization: 'Bearer ' + auth.token },
      })
      .then(() => {
        setUploads(uploads.filter(file => file._id !== fileId));

        if (selectedFile && selectedFile._id === fileId) {
          setSelectedFile(null);
        }
      })
      .catch((e) => {
        console.error('Error deleting file:', e);
        alert('Failed to delete file');
      });
  };

  const deleteChart = (chartId) => {
    const updatedCharts = charts.filter(chart => chart.id !== chartId);
    setCharts(updatedCharts);
    localStorage.setItem('userCharts', JSON.stringify(updatedCharts));

    if (selectedChart && selectedChart.id === chartId) {
      setSelectedChart(null);
    }
  };

  const deleteInsight = (insightId) => {
    const updatedInsights = aiInsights.filter(insight => insight.id !== insightId);
    setAiInsights(updatedInsights);
    localStorage.setItem('userInsights', JSON.stringify(updatedInsights));

    if (selectedInsight && selectedInsight.id === insightId) {
      setSelectedInsight(null);
    }
  };

  const saveChart = (chartDataFromUpload) => {
    const newChart = {
      id: Date.now(),
      name: `${chartDataFromUpload.yAxis} by ${chartDataFromUpload.xAxis}`,
      type: chartDataFromUpload.chartType,
      data: chartDataFromUpload.chartData.data,
      options: chartDataFromUpload.chartData.options,
      xAxis: chartDataFromUpload.xAxis,
      yAxis: chartDataFromUpload.yAxis,
      createdAt: new Date().toISOString()
    };

    const updatedCharts = [...charts, newChart];
    setCharts(updatedCharts);
    localStorage.setItem('userCharts', JSON.stringify(updatedCharts));
  };

  const saveInsight = (insightData) => {
    const newInsight = {
      id: Date.now(),
      title: `AI Analysis - ${new Date().toLocaleDateString()}`,
      summary: insightData.summary,
      createdAt: new Date().toISOString()
    };

    const updatedInsights = [...aiInsights, newInsight];
    setAiInsights(updatedInsights);
    localStorage.setItem('userInsights', JSON.stringify(updatedInsights));
  };

  const viewChart = (chart) => {
    setSelectedChart(chart);
    setSelectedFile(null);
    setSelectedInsight(null);
  };

  const viewInsight = (insight) => {
    setSelectedInsight(insight);
    setSelectedFile(null);
    setSelectedChart(null);
  };


  const renderChart = (chartData) => {
    if (!chartData) return <div>No chart data available</div>;

    const type = chartData.type || chartData.chartType;
    const labels = chartData.data?.labels || chartData.labels || [];
    const datasets = chartData.data?.datasets || chartData.datasets || [];

    if (!labels.length || !datasets.length) {
      return <div>Invalid chart data</div>;
    }

    const chartProps = {
      data: { labels, datasets },
      options: chartData.options || {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: chartData.name || `${chartData.yAxis} by ${chartData.xAxis}`,
            font: {
              size: 16
            }
          },
        },
        maintainAspectRatio: false
      }
    };

    switch (type) {
      case "bar":
        return <Bar {...chartProps} />;
      case "line":
        return <Line {...chartProps} />;
      case "pie":
        return <Pie {...chartProps} />;
      case "doughnut":
        return <Doughnut {...chartProps} />;
      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      <div className="w-64 bg-gradient-to-b from-gray-900 to-black text-white shadow-xl fixed h-full overflow-y-auto">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center">
            <i className="fas fa-table mr-2 text-green-400"></i>
            Excel Analytics
          </h2>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedFile(null);
              setSelectedChart(null);
              setSelectedInsight(null);
            }}
            className={`w-full flex items-center p-4 rounded-lg transition-all duration-300 group relative overflow-hidden ${activeTab === 'dashboard'
                ? 'bg-green-700 text-white font-medium shadow-lg'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <i className="fas fa-tachometer-alt mr-3 text-lg"></i>
            Dashboard
            {activeTab === 'dashboard' && (
              <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('files');
              setSelectedFile(null);
              setSelectedChart(null);
              setSelectedInsight(null);
            }}
            className={`w-full flex items-center p-4 rounded-lg transition-all duration-300 group relative overflow-hidden ${activeTab === 'files'
                ? 'bg-green-700 text-white font-medium shadow-lg'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <i className="fas fa-file-excel mr-3 text-lg"></i>
            My Files
            {uploads.length > 0 && (
              <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {uploads.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('charts');
              setSelectedFile(null);
              setSelectedChart(null);
              setSelectedInsight(null);
            }}
            className={`w-full flex items-center p-4 rounded-lg transition-all duration-300 group relative overflow-hidden ${activeTab === 'charts'
                ? 'bg-green-700 text-white font-medium shadow-lg'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <i className="fas fa-chart-bar mr-3 text-lg"></i>
            My Charts
            {charts.length > 0 && (
              <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {charts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('insights');
              setSelectedFile(null);
              setSelectedChart(null);
              setSelectedInsight(null);
            }}
            className={`w-full flex items-center p-4 rounded-lg transition-all duration-300 group relative overflow-hidden ${activeTab === 'insights'
                ? 'bg-green-700 text-white font-medium shadow-lg'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <i className="fas fa-brain mr-3 text-lg"></i>
            AI Insights
            {aiInsights.length > 0 && (
              <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {aiInsights.length}
              </span>
            )}
          </button>
        </nav>


        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center mr-3 text-white shadow-md">
              <i className="fas fa-user"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{auth.user?.name || 'User'}</p>
              <p className="text-xs text-gray-400">{auth.user?.email}</p>
            </div>
          </div>
        </div>
      </div>


      <div className="flex-1 ml-64 p-6 overflow-auto">

        {activeTab === 'dashboard' && (
          <div className="space-y-6">

            <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-2 rounded-lg mr-3">
                  <i className="fas fa-tachometer-alt"></i>
                </span>
                Dashboard Overview
              </h1>
              {auth.user ? (
                <p className="mt-2 text-gray-600">
                  Welcome back, <span className="font-semibold text-green-600">{auth.user.name || auth.user.email}</span>.
                  Here's what's happening with your data.
                </p>
              ) : (
                <p className="mt-2 text-gray-400">Please login</p>
              )}
            </header>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg flex items-center justify-center mr-4 text-white shadow-md">
                    <i className="fas fa-file-excel text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Files</p>
                    <p className="text-2xl font-bold text-gray-800">{uploads.length}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Active datasets
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center mr-4 text-white shadow-md">
                    <i className="fas fa-chart-bar text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Charts Created</p>
                    <p className="text-2xl font-bold text-gray-800">{charts.length}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Visualizations
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mr-4 text-white shadow-md">
                    <i className="fas fa-brain text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">AI Insights</p>
                    <p className="text-2xl font-bold text-gray-800">{aiInsights.length}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Data analysis
                  </p>
                </div>
              </div>
            </div>


            {auth.token && (
              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <i className="fas fa-upload mr-2 text-green-500"></i>
                    Upload New Excel File
                  </h2>
                  <p className="text-gray-600">Process your data and create visualizations</p>
                </div>
                <UploadForm
                  onUploaded={refreshUploads}
                  onChartSave={saveChart}
                  onInsightSave={saveInsight}
                />
              </section>
            )}
          </div>
        )}


        {activeTab === 'files' && (
          <div>
            <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-2 rounded-lg mr-3">
                  <i className="fas fa-file-excel"></i>
                </span>
                My Files
              </h1>
              <p className="mt-2 text-gray-600">Manage your uploaded Excel files and datasets</p>
            </header>

            {isLoading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="text-center">
                  <i className="fas fa-spinner fa-spin text-green-500 text-4xl mb-3"></i>
                  <p className="text-gray-500">Loading your files...</p>
                </div>
              </div>
            ) : uploads.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {uploads.map((u) => (
                  <div
                    key={u._id}
                    className={`bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group ${selectedFile && selectedFile._id === u._id ? 'ring-2 ring-green-400 scale-[1.02]' : ''
                      }`}
                  >

                    <div className="absolute inset-0 -left-full group-hover:left-100 transition-all duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg flex items-center justify-center mr-4 text-white shadow-md">
                        <i className="fas fa-file-excel"></i>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition transform hover:scale-110"
                        onClick={() => deleteFile(u._id)}
                        title="Delete file"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <strong className="block text-lg text-gray-800 relative z-10 truncate">{u.filename}</strong>
                    <span className="text-sm text-gray-500 relative z-10">Rows: {u.parsed?.length || 0}</span>
                    <p className="text-xs text-gray-400 mt-3 relative z-10">
                      Uploaded: {new Date(u.createdAt).toLocaleString()}
                    </p>
                    <div className="flex mt-4 space-x-2 relative z-10">
                      <button
                        className="text-sm bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition shadow-md flex items-center"
                        onClick={() => handleFileSelect(u)}
                      >
                        <i className="fas fa-eye mr-1"></i> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                  <i className="fas fa-file-excel text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No files uploaded yet</h3>
                <p className="text-gray-500 mt-2 mb-4">Upload your first Excel file to get started with data analysis</p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition flex items-center mx-auto shadow-md"
                >
                  <i className="fas fa-upload mr-2"></i>
                  Upload File
                </button>
              </div>
            )}
          </div>
        )}


        {activeTab === 'charts' && (
          <div>
            <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 rounded-lg mr-3">
                  <i className="fas fa-chart-bar"></i>
                </span>
                My Charts
              </h1>
              <p className="mt-2 text-gray-600">Visualizations created from your data</p>
            </header>

            {charts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {charts.map((chart) => (
                  <div
                    key={chart.id}
                    className={`bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group ${selectedChart && selectedChart.id === chart.id ? 'ring-2 ring-blue-400 scale-[1.02]' : ''
                      }`}
                  >

                    <div className="absolute inset-0 -left-full group-hover:left-100 transition-all duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center mr-4 text-white shadow-md">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition transform hover:scale-110"
                        onClick={() => deleteChart(chart.id)}
                        title="Delete chart"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <strong className="block text-lg text-gray-800 relative z-10">{chart.name}</strong>
                    <span className="text-sm text-gray-500 relative z-10 capitalize">Type: {chart.type}</span>
                    <p className="text-xs text-gray-400 mt-3 relative z-10">
                      Created: {new Date(chart.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex mt-4 space-x-2 relative z-10">
                      <button
                        className="text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition shadow-md flex items-center"
                        onClick={() => viewChart(chart)}
                      >
                        <i className="fas fa-eye mr-1"></i> View Chart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                  <i className="fas fa-chart-bar text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No charts created yet</h3>
                <p className="text-gray-500 mt-2">Create your first visualization from your Excel data</p>
              </div>
            )}
          </div>
        )}


        {activeTab === 'insights' && (
          <div>
            <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg mr-3">
                  <i className="fas fa-brain"></i>
                </span>
                AI Insights
              </h1>
              <p className="mt-2 text-gray-600">Intelligent analysis generated from your data</p>
            </header>

            {aiInsights.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group ${selectedInsight && selectedInsight.id === insight.id ? 'ring-2 ring-purple-400 scale-[1.02]' : ''
                      }`}
                  >

                    <div className="absolute inset-0 -left-full group-hover:left-100 transition-all duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mr-4 text-white shadow-md">
                        <i className="fas fa-brain"></i>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition transform hover:scale-110"
                        onClick={() => deleteInsight(insight.id)}
                        title="Delete insight"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 relative z-10">{insight.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 relative z-10">{insight.summary}</p>
                    <p className="text-xs text-gray-400 mt-3 relative z-10">
                      Created: {new Date(insight.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex mt-4 space-x-2 relative z-10">
                      <button
                        className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition shadow-md flex items-center"
                        onClick={() => viewInsight(insight)}
                      >
                        <i className="fas fa-eye mr-1"></i> View Insight
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                  <i className="fas fa-brain text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No AI insights yet</h3>
                <p className="text-gray-500 mt-2">Generate insights from your data using AI analysis</p>
              </div>
            )}
          </div>
        )}


        {(selectedFile || selectedChart || selectedInsight) && (
          <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              {selectedFile && (
                <>
                  <span className="bg-green-100 text-green-800 p-2 rounded-lg mr-3">
                    <i className="fas fa-file-excel"></i>
                  </span>
                  File Details: {selectedFile.filename}
                </>
              )}
              {selectedChart && (
                <>
                  <span className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
                    <i className="fas fa-chart-bar"></i>
                  </span>
                  Chart Details: {selectedChart.name}
                </>
              )}
              {selectedInsight && (
                <>
                  <span className="bg-purple-100 text-purple-800 p-2 rounded-lg mr-3">
                    <i className="fas fa-brain"></i>
                  </span>
                  Insight Details: {selectedInsight.title}
                </>
              )}
            </h2>

            {selectedFile && (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Rows</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedFile.parsed?.length || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Uploaded</p>
                    <p className="text-lg font-semibold text-gray-800">{new Date(selectedFile.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {selectedFile.parsed && selectedFile.parsed.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                      <i className="fas fa-table mr-2 text-gray-500"></i>
                      Data Preview
                    </h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(selectedFile.parsed[0]).map((key) => (
                              <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedFile.parsed.slice(0, 10).map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              {Object.values(row).map((value, i) => (
                                <td key={i} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {selectedFile.parsed.length > 10 && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Showing first 10 rows of {selectedFile.parsed.length}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedChart && (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-500">Chart Type</p>
                    <p className="text-lg font-semibold text-blue-800 capitalize">{selectedChart.type}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-500">Created</p>
                    <p className="text-lg font-semibold text-blue-800">{new Date(selectedChart.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <div className="h-96">
                    {renderChart(selectedChart)}
                  </div>
                </div>
              </div>
            )}

            {selectedInsight && (
              <div>
                <div className="mb-4 bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm text-purple-500">Created</p>
                  <p className="text-lg font-semibold text-purple-800">{new Date(selectedInsight.createdAt).toLocaleString()}</p>
                </div>

                <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2 flex items-center">
                    <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>
                    Summary
                  </h3>
                  <p className="text-purple-700 leading-relaxed">{selectedInsight.summary}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedFile(null);
                setSelectedChart(null);
                setSelectedInsight(null);
              }}
              className="mt-6 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center ml-auto"
            >
              <i className="fas fa-times mr-2"></i> Close Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}