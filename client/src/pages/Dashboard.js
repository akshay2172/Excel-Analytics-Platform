import React, { useState, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const auth = useSelector(s => s.auth);
  const [uploads, setUploads] = useState([]);
  const [charts, setCharts] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!auth.token) return;
    
    setIsLoading(true);
    // Fetch user uploads
    axios
      .get('http://localhost:5000/api/file', {
        headers: { Authorization: 'Bearer ' + auth.token },
      })
      .then((r) => {
        setUploads(r.data);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
      
    // Fetch charts
    fetchCharts();
    
    // Fetch AI insights
    fetchAIInsights();
  }, [auth.token]);

  const fetchCharts = () => {
    // In a real app, you would fetch from your backend API
    // For now, using mock data
    const mockCharts = [
      { id: 1, name: 'Sales Trend Analysis', type: 'Line Chart', createdAt: '2023-05-15' },
      { id: 2, name: 'Revenue by Category', type: 'Bar Chart', createdAt: '2023-06-20' },
      { id: 3, name: 'Customer Distribution', type: 'Pie Chart', createdAt: '2023-07-10' }
    ];
    setCharts(mockCharts);
  };

  const fetchAIInsights = () => {
    // In a real app, you would fetch from your backend API
    // For now, using mock data
    const mockInsights = [
      { 
        id: 1, 
        title: 'Sales Forecast Q4 2023', 
        summary: 'Predicted 15% growth based on historical data', 
        createdAt: '2023-08-05' 
      },
      { 
        id: 2, 
        title: 'Customer Segmentation Analysis', 
        summary: 'Identified 3 key customer segments with distinct behaviors', 
        createdAt: '2023-08-12' 
      }
    ];
    setAiInsights(mockInsights);
  };

  const refreshUploads = () => {
    axios
      .get('http://localhost:5000/api/file', {
        headers: { Authorization: 'Bearer ' + auth.token },
      })
      .then((r) => setUploads(r.data));
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const deleteFile = (fileId) => {
    // In a real app, you would make an API call to delete the file
    setUploads(uploads.filter(file => file._id !== fileId));
  };

  const deleteChart = (chartId) => {
    // In a real app, you would make an API call to delete the chart
    setCharts(charts.filter(chart => chart.id !== chartId));
  };

  const deleteInsight = (insightId) => {
    // In a real app, you would make an API call to delete the insight
    setAiInsights(aiInsights.filter(insight => insight.id !== insightId));
  };

  const saveChart = (chartData) => {
    // In a real app, you would make an API call to save the chart
    const newChart = {
      id: Date.now(),
      name: `${chartData.yAxis} by ${chartData.xAxis}`,
      type: chartData.chartType,
      createdAt: new Date().toISOString()
    };
    setCharts([...charts, newChart]);
  };

  const saveInsight = (insightData) => {
    // In a real app, you would make an API call to save the insight
    const newInsight = {
      id: Date.now(),
      title: `AI Analysis - ${new Date().toLocaleDateString()}`,
      summary: insightData.summary,
      createdAt: new Date().toISOString()
    };
    setAiInsights([...aiInsights, newInsight]);
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
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-green-100 text-green-800 font-medium shadow-sm' : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}`}
          >
            <i className="fas fa-tachometer-alt mr-3"></i>
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('files')}
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${activeTab === 'files' ? 'bg-green-100 text-green-800 font-medium shadow-sm' : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}`}
          >
            <i className="fas fa-file-excel mr-3"></i>
            My Files
            {uploads.length > 0 && (
              <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {uploads.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('charts')}
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${activeTab === 'charts' ? 'bg-green-100 text-green-800 font-medium shadow-sm' : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}`}
          >
            <i className="fas fa-chart-bar mr-3"></i>
            My Charts
            {charts.length > 0 && (
              <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {charts.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('insights')}
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${activeTab === 'insights' ? 'bg-green-100 text-green-800 font-medium shadow-sm' : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}`}
          >
            <i className="fas fa-brain mr-3"></i>
            AI Insights
            {aiInsights.length > 0 && (
              <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {aiInsights.length}
              </span>
            )}
          </button>
        </nav>
        
        {/* Fixed user info at bottom */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-user text-green-600"></i>
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
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-green-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-file-excel text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Files</p>
                    <p className="text-2xl font-bold text-green-600">{uploads.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-green-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-chart-bar text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Charts Created</p>
                    <p className="text-2xl font-bold text-green-600">{charts.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-green-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-brain text-green-600 text-xl"></i>
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
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-green-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <i className="fas fa-file-excel text-green-600"></i>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-red-600 transition"
                        onClick={() => deleteFile(u._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <strong className="block text-lg text-gray-800">{u.filename}</strong>
                    <span className="text-sm text-gray-500">Rows: {u.parsed?.length || 0}</span>
                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(u.createdAt).toLocaleString()}
                    </p>
                    <div className="flex mt-4 space-x-2">
                      <button 
                        className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition"
                        onClick={() => handleFileSelect(u)}
                      >
                        <i className="fas fa-eye mr-1"></i> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-file-excel text-green-600 text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No files uploaded yet</h3>
                <p className="text-gray-500 mt-2">Upload your first Excel file to get started</p>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center mx-auto"
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
                <i className="fas fa-chart-bar mr-2 text-green-600"></i>
                My Charts
              </h1>
              <p className="mt-2 text-gray-600">Visualizations created from your data</p>
            </header>

            {charts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {charts.map((chart) => (
                  <div
                    key={chart.id}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-green-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <i className="fas fa-chart-bar text-green-600"></i>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-red-600 transition"
                        onClick={() => deleteChart(chart.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <strong className="block text-lg text-gray-800">{chart.name}</strong>
                    <span className="text-sm text-gray-500">Type: {chart.type}</span>
                    <p className="text-xs text-gray-400 mt-3">
                      Created: {new Date(chart.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex mt-4 space-x-2">
                      <button className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition">
                        <i className="fas fa-eye mr-1"></i> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-chart-bar text-green-600 text-3xl"></i>
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
              <div className="space-y-6">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-green-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <i className="fas fa-brain text-green-600"></i>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-red-600 transition"
                        onClick={() => deleteInsight(insight.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{insight.title}</h3>
                    <p className="text-gray-600 mb-4">{insight.summary}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        Created: {new Date(insight.createdAt).toLocaleDateString()}
                      </span>
                      <button className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition">
                        <i className="fas fa-eye mr-1"></i> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-brain text-green-600 text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No AI insights yet</h3>
                <p className="text-gray-500 mt-2">Generate insights from your data using AI</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}