import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Zap, Activity, ArrowRight, Sparkles, TrendingUp, Box, Gauge, FileText, BookOpen, Shield, Award, Target, BarChart3 } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <Navbar isLoggedIn={true} />
      
      {/* Hero Section - Full Width */}
      <div className="relative min-h-screen w-full flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"></div>
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0 relative z-10">
          <div className="text-center mb-16 animate-slide-up space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full shadow-sm">
              <Sparkles className="w-5 h-5 text-primary-600 animate-pulse" />
              <span className="text-sm font-semibold text-primary-700">Manufacturing Dashboard</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] px-4">
              Select Production <br />
              <span className="gradient-text drop-shadow-sm">Transformer Type</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto px-4 leading-relaxed">
              Start automated transformer manufacturing with ML-powered error prediction. 
              Choose your transformer type for quality control analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-6xl mx-auto animate-scale-in px-4">
            {/* Current Transformer Card */}
            <Link 
              to="/input-ct" 
              className="group relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white rounded-3xl p-10 lg:p-12 min-h-[350px] flex flex-col justify-between hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-4 border-white/20"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Gauge className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl font-black mb-3 drop-shadow-md">Current Transformer</h3>
                  <p className="text-primary-100 text-base lg:text-lg font-medium">Automated CT Manufacturing & Testing</p>
                  <div className="mt-3 space-y-1 text-sm text-primary-50">
                    <p>• Burden Range: 5-30 VA</p>
                    <p>• Accuracy Class: 0.2, 0.5, 1.0, 3.0</p>
                    <p>• 20 ML Error Predictions</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/20">
                <span className="text-base lg:text-lg font-bold">Start CT Production</span>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            
            {/* Potential Transformer Card */}
            <Link 
              to="/input-pt" 
              className="group relative overflow-hidden bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700 text-white rounded-3xl p-10 lg:p-12 min-h-[350px] flex flex-col justify-between hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-4 border-white/20"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="relative z-10 space-y-4">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Zap className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl font-black mb-3 drop-shadow-md">Potential Transformer</h3>
                  <p className="text-accent-100 text-base lg:text-lg font-medium">Automated PT Manufacturing & Testing</p>
                  <div className="mt-3 space-y-1 text-sm text-accent-50">
                    <p>• Voltage: 11kV - 33kV</p>
                    <p>• BDV Oil Analysis</p>
                    <p>• 6 ML Predictions</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/20">
                <span className="text-base lg:text-lg font-bold">Start PT Production</span>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Engineering Capabilities Section */}
      <div className="bg-white py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              ML-Powered <span className="gradient-text">Manufacturing Platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Automated transformer production with Random Forest error prediction
            </p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-16 max-w-6xl mx-auto">
            <div className="card text-center hover:shadow-xl transition-shadow group cursor-pointer">
              <FileText className="w-12 h-12 text-primary-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-gray-900 mb-1">Documentation</h4>
              <p className="text-sm text-gray-600">Production guides & analytics</p>
            </div>
            <div className="card text-center hover:shadow-xl transition-shadow group cursor-pointer">
              <BookOpen className="w-12 h-12 text-accent-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-gray-900 mb-1">ML Models</h4>
              <p className="text-sm text-gray-600">Random Forest algorithms</p>
            </div>
            <div className="card text-center hover:shadow-xl transition-shadow group cursor-pointer">
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-gray-900 mb-1">Quality Control</h4>
              <p className="text-sm text-gray-600">Automated validation</p>
            </div>
            <div className="card text-center hover:shadow-xl transition-shadow group cursor-pointer">
              <Award className="w-12 h-12 text-accent-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-gray-900 mb-1">Analytics</h4>
              <p className="text-sm text-gray-600">Production metrics</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Image */}
            <div className="flex justify-center animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-3xl blur-3xl opacity-20"></div>
                <img 
                  src="/HomeTransImag.png" 
                  alt="Professional Transformer Engineering" 
                  className="relative w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
            
            {/* Manufacturing Features List */}
            <div className="space-y-6">
              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Automated Measurements</h3>
                  <p className="text-gray-600">
                    Real-time automated measurement systems for CT and PT manufacturing with integrated sensor networks
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Random Forest Error Prediction</h3>
                  <p className="text-gray-600">
                    Machine learning models predict manufacturing errors achieving 70% reduction in manual errors across production
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Production Analytics</h3>
                  <p className="text-gray-600">
                    Comprehensive quality metrics, automated testing reports, and real-time performance monitoring dashboards
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Box className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">3D Visualization</h3>
                  <p className="text-gray-600">
                    Interactive 3D models for production monitoring and quality control with detailed measurement visualizations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="card bg-gradient-to-r from-primary-600 to-accent-600 text-white p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your Production Process
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Select your transformer type and begin automated manufacturing with ML error prediction
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/input-ct" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-lg text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <Gauge className="w-5 h-5" />
                Manufacture CT
              </Link>
              <Link 
                to="/input-pt" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg text-lg border-2 border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300"
              >
                <Zap className="w-5 h-5" />
                Manufacture PT
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardPage;