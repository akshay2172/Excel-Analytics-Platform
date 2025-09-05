import React, { useState, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import "../index.css";

// Register ChartJS components
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
    if (!auth.token) return;
    
    setIsLoading(true);
    // Fetch user uploads
    fetchUploads();
    
    // Fetch charts and insights from localStorage
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
    // In a real app, you would make an API call to delete the file
    axios
      .delete(`http://localhost:5000/api/file/${fileId}`, {
        headers: { Authorization: 'Bearer ' + auth.token },
      })
      .then(() => {
        setUploads(uploads.filter(file => file._id !== fileId));
        // If the deleted file was selected, clear the selection
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

 const saveChart = (chartData) => {
  const newChart = {
    id: Date.now(),
    name: `${chartData.yAxis} by ${chartData.xAxis}`,
    type: chartData.chartType,
    data: {
      labels: chartData.labels,
      datasets: chartData.datasets
    },
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

  // Function to render the appropriate chart based on type
const renderChart = (chartData) => {
  if (!chartData) return <div>No chart data available</div>;

  // Support both possible keys
  const type = chartData.type || chartData.chartType;

  const labels =
    chartData.data?.labels || chartData.labels || [];
  const datasets =
    chartData.data?.datasets || chartData.datasets || [];

  if (!labels.length || !datasets.length) {
    return <div>Invalid chart data</div>;
  }

  const chartProps = { data: { labels, datasets } };

  switch (type) {
    case "bar":
      return <Bar {...chartProps} />;
    case "line":
      return <Line {...chartProps} />;
    case "pie":
      return <Pie {...chartProps} />;
    default:
      return <div>Unsupported chart type: {type}</div>;
  }
};


  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Navigation - Fixed position */}
      <div className="w-64 bg-white text-gray-800 shadow-lg border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center">
            <i className="fas fa-table mr-2 text-green-600"></i>
            Excel Analytics
          </h2>
        </div>
        
        <nav className="p-4 space-y-4">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedFile(null);
              setSelectedChart(null);
              setSelectedInsight(null);
            }}
            className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              activeTab === 'dashboard' 
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium shadow-lg' 
                : 'text-gray-600 hover:bg-gradient-to-r hover:from-green-300 hover:to-teal-50 hover:text-green-700'
            }`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <i className="fas fa-tachometer-alt mr-3 text-lg"></i>
            Dashboard
            {activeTab === 'dashboard' && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>
          
          <button
            onClick={() => {
              setActiveTab('files');
              setSelectedFile(null);
              setSelectedChart(null);
              setSelectedInsight(null);
            }}
            className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              activeTab === 'files' 
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium shadow-lg' 
                : 'text-gray-600 hover:bg-gradient-to-r hover:from-green-300 hover:to-teal-50 hover:text-green-700'
            }`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <i className="fas fa-file-excel mr-3 text-lg"></i>
            My Files
            {uploads.length > 0 && (
              <span className="ml-auto bg-white text-green-600 text-xs px-2 py-1 rounded-full font-bold">
                {uploads.length}
              </span>
            )}
            {activeTab === 'files' && (
              <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>
          
          <button
            onClick={() => {
              setActiveTab('charts');
              setSelectedFile(null);
              setSelectedChart(null);
              setSelectedInsight(null);
            }}
            className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              activeTab === 'charts' 
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium shadow-lg' 
                : 'text-gray-600 hover:bg-gradient-to-r hover:from-green-300 hover:to-teal-50 hover:text-green-700'
            }`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <i className="fas fa-chart-bar mr-3 text-lg"></i>
            My Charts
            {charts.length > 0 && (
              <span className="ml-auto bg-white text-green-600 text-xs px-2 py-1 rounded-full font-bold">
                {charts.length}
              </span>
            )}
            {activeTab === 'charts' && (
              <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>
          
          <button
            onClick={() => {
              setActiveTab('insights');
              setSelectedFile(null);
              setSelectedChart(null);
              setSelectedInsight(null);
            }}
            className={`w-full flex items-center p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              activeTab === 'insights' 
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium shadow-lg' 
                : 'text-gray-600 hover:bg-gradient-to-r hover:from-green-300 hover:to-teal-50 hover:text-green-700'
            }`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <i className="fas fa-brain mr-3 text-lg"></i>
            AI Insights
            {aiInsights.length > 0 && (
              <span className="ml-auto bg-white text-green-600 text-xs px-2 py-1 rounded-full font-bold">
                {aiInsights.length}
              </span>
            )}
            {activeTab === 'insights' && (
              <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </button>
        </nav>
        
        {/* Fixed user info at bottom */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center mr-3 text-white">
              <i className="fas fa-user"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{auth.user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{auth.user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - With left margin for sidebar */}
      <div className="flex-1 ml-64 p-6 overflow-auto">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Header */}
            <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard</h1>
              {auth.user ? (
                <p className="mt-2 text-gray-600">
                  Welcome back, <span className="font-semibold text-green-600">{auth.user.name || auth.user.email}</span>
                </p>
              ) : (
                <p className="mt-2 text-gray-400">Please login</p>
              )}
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-200 to-teal-50 p-5 rounded-2xl shadow-sm border border-green-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg flex items-center justify-center mr-4 text-white">
                    <i className="fas fa-file-excel text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Files</p>
                    <p className="text-2xl font-bold text-green-600">{uploads.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-100 to-teal-100 p-5 rounded-2xl shadow-sm border border-green-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg flex items-center justify-center mr-4 text-white">
                    <i className="fas fa-chart-bar text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Charts Created</p>
                    <p className="text-2xl font-bold text-green-600">{charts.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-100 to-teal-100 p-5 rounded-2xl shadow-sm border border-green-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg flex items-center justify-center mr-4 text-white">
                    <i className="fas fa-brain text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">AI Insights</p>
                    <p className="text-2xl font-bold text-green-600">{aiInsights.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Section - Below the stats */}
            {auth.token && (
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <UploadForm 
                  onUploaded={refreshUploads} 
                  onChartSave={saveChart}
                  onInsightSave={saveInsight}
                />
              </section>
            )}
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div>
            <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <i className="fas fa-file-excel mr-2 text-green-600"></i>
                My Files
              </h1>
              <p className="mt-2 text-gray-600">Manage your uploaded Excel files</p>
            </header>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <i className="fas fa-spinner fa-spin text-green-600 text-3xl"></i>
              </div>
            ) : uploads.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploads.map((u) => (
                  <div
                    key={u._id}
                    className={`bg-gradient-to-br from-green-200 to-teal-50 p-5 rounded-2xl shadow-sm border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group ${
                      selectedFile && selectedFile._id === u._id ? 'ring-2 ring-green-500 scale-105' : ''
                    }`}
                  >
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 -left-full group-hover:left-100 transition-all duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg flex items-center justify-center mr-4 text-white">
                        <i className="fas fa-file-excel"></i>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-red-600 transition"
                        onClick={() => deleteFile(u._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <strong className="block text-lg text-gray-800 relative z-10">{u.filename}</strong>
                    <span className="text-sm text-gray-500 relative z-10">Rows: {u.parsed?.length || 0}</span>
                    <p className="text-xs text-gray-400 mt-3 relative z-10">
                      {new Date(u.createdAt).toLocaleString()}
                    </p>
                    <div className="flex mt-4 space-x-2 relative z-10">
                      <button 
                        className="text-sm bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-lg hover:from-green-600 hover:to-teal-600 transition shadow-md"
                        onClick={() => handleFileSelect(u)}
                      >
                        <i className="fas fa-eye mr-1"></i> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-200 to-teal-50 p-10 rounded-2xl shadow-sm border border-green-100 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <i className="fas fa-file-excel text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No files uploaded yet</h3>
                <p className="text-gray-500 mt-2">Upload your first Excel file to get started</p>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-4 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition flex items-center mx-auto shadow-md"
                >
                  <i className="fas fa-upload mr-2"></i>
                  Upload File
                </button>
              </div>
            )}
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div>
            <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <i className="fas fa-chart-bar mr-2 text-green-800"></i>
                My Charts
              </h1>
              <p className="mt-2 text-gray-600">Visualizations created from your data</p>
            </header>

            {charts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {charts.map((chart) => (
                  <div
                    key={chart.id}
                    className={`bg-gradient-to-br from-green-200 to-teal-50 p-5 rounded-2xl shadow-sm border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group ${
                      selectedChart && selectedChart.id === chart.id ? 'ring-2 ring-green-500 scale-105' : ''
                    }`}
                  >
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 -left-full group-hover:left-100 transition-all duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg flex items-center justify-center mr-4 text-white">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-red-600 transition"
                        onClick={() => deleteChart(chart.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <strong className="block text-lg text-gray-800 relative z-10">{chart.name}</strong>
                    <span className="text-sm text-gray-500 relative z-10">Type: {chart.type}</span>
                    <p className="text-xs text-gray-400 mt-3 relative z-10">
                      Created: {new Date(chart.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex mt-4 space-x-2 relative z-10">
                      <button 
                        className="text-sm bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-lg hover:from-green-600 hover:to-teal-600 transition shadow-md"
                        onClick={() => viewChart(chart)}
                      >
                        <i className="fas fa-eye mr-1"></i> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-200 to-teal-50 p-10 rounded-2xl shadow-sm border border-green-100 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <i className="fas fa-chart-bar text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No charts created yet</h3>
                <p className="text-gray-500 mt-2">Create your first visualization from your data</p>
              </div>
            )}
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'insights' && (
          <div>
            <header className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <i className="fas fa-brain mr-2 text-green-600"></i>
                AI Insights
              </h1>
              <p className="mt-2 text-gray-600">Intelligent analysis generated from your data</p>
            </header>

            {aiInsights.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`bg-gradient-to-br from-green-200 to-teal-50 p-5 rounded-2xl shadow-sm border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group ${
                      selectedInsight && selectedInsight.id === insight.id ? 'ring-2 ring-green-500 scale-105' : ''
                    }`}
                  >
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 -left-full group-hover:left-100 transition-all duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg flex items-center justify-center mr-4 text-white">
                        <i className="fas fa-brain"></i>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-red-600 transition"
                        onClick={() => deleteInsight(insight.id)}
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
                        className="text-sm bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-lg hover:from-green-600 hover:to-teal-600 transition shadow-md"
                        onClick={() => viewInsight(insight)}
                      >
                        <i className="fas fa-eye mr-1"></i> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-200 to-teal-50 p-10 rounded-2xl shadow-sm border border-green-100 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <i className="fas fa-brain text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No AI insights yet</h3>
                <p className="text-gray-500 mt-2">Generate insights from your data using AI</p>
              </div>
            )}
          </div>
        )}

        {/* Detail View Section */}
        {(selectedFile || selectedChart || selectedInsight) && (
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedFile && `File Details: ${selectedFile.filename}`}
              {selectedChart && `Chart Details: ${selectedChart.name}`}
              {selectedInsight && `Insight Details: ${selectedInsight.title}`}
            </h2>
            
            {selectedFile && (
              <div>
                <p className="text-gray-600">Rows: {selectedFile.parsed?.length || 0}</p>
                <p className="text-gray-600">Uploaded: {new Date(selectedFile.createdAt).toLocaleString()}</p>
                
                {selectedFile.parsed && selectedFile.parsed.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Data Preview</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(selectedFile.parsed[0]).map((key) => (
                              <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedFile.parsed.slice(0, 20).map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((value, i) => (
                                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {selectedChart && (
              <div>
                <p className="text-gray-600">Type: {selectedChart.type}</p>
                <p className="text-gray-600">Created: {new Date(selectedChart.createdAt).toLocaleString()}</p>
                
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <div className="h-96">
                    {renderChart(selectedChart)}
                  </div>
                </div>
              </div>
            )}
            
            {selectedInsight && (
              <div>
                <p className="text-gray-600">Created: {new Date(selectedInsight.createdAt).toLocaleString()}</p>
                
                <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Summary</h3>
                  <p className="text-green-700">{selectedInsight.summary}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => {
                setSelectedFile(null);
                setSelectedChart(null);
                setSelectedInsight(null);
              }}
              className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              <i className="fas fa-times mr-2"></i> Close Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}