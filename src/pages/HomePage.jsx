import { Link } from 'react-router-dom';
import { Cpu, Shield, Award, CheckCircle, ArrowRight, Sparkles, Gauge, BarChart3, Zap, Target, Play, ChevronDown } from 'lucide-react';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - Glass Morphism */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="text-2xl sm:text-3xl font-bold hover:scale-105 transition-transform group">
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 bg-clip-text text-transparent group-hover:from-primary-500 group-hover:to-accent-500 transition-all">
                Transformer
              </span>
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">GO</span>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <Link 
                to="/login" 
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="group relative px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <span className="relative z-10">Start Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Optimized for Mobile */}
      <section className="relative min-h-screen w-full flex items-center overflow-hidden pt-20 pb-8">
        {/* Simplified Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50">
          {/* Grid Pattern - Hidden on mobile for performance */}
          <div className="hidden md:block absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                             linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem'
          }}></div>
          
          {/* Simplified Floating Orbs */}
          <div className="absolute top-1/4 left-[10%] w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-primary-400 to-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-1/3 right-[10%] w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-accent-400 to-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            {/* Left Content - Enhanced for Mobile */}
            <div className="space-y-4 md:space-y-5 text-center lg:text-left animate-slide-up lg:order-1">
              {/* Badge - Mobile Optimized */}
              <div className="inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-white/80 backdrop-blur-xl border border-primary-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-default">
                <div className="relative">
                  <Cpu className="w-3 md:w-3.5 h-3 md:h-3.5 text-primary-600" />
                  <div className="absolute inset-0 bg-primary-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity animate-pulse"></div>
                </div>
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-primary-700">ML-Powered Manufacturing Platform</span>
              </div>
              
              {/* Main Heading - Mobile Optimized */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.15] tracking-tight">
                <span className="inline-block bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Automated
                </span>
                <br />
                <span className="text-gray-900">Transformer</span>
                <br />
                <span className="inline-block bg-gradient-to-r from-accent-600 via-accent-500 to-primary-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Manufacturing
                </span>
              </h1>
              
              {/* Description - Mobile Optimized */}
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                Automated measurement platform for CT & PT manufacturing with 
                <span className="text-primary-600 font-bold"> Random Forest</span> error prediction. Reducing manual errors by 70%.
              </p>

              {/* Trust Badges - Mobile Optimized */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 pt-2">
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-default">
                  <Shield className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-accent-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-700">70% Error Reduction</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-default">
                  <Award className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-700">ML Automation</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-default">
                  <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-accent-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-700">Production Ready</span>
                </div>
              </div>

              {/* CTA Buttons - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 max-w-md mx-auto lg:mx-0">
                <Link 
                  to="/register" 
                  className="group relative px-6 py-3 text-sm md:text-base font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Manufacturing Project
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  to="/login" 
                  className="group px-6 py-3 text-sm md:text-base font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:text-primary-600 transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Access Dashboard
                  <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </Link>
              </div>

              {/* Stats - Mobile Optimized */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 max-w-md mx-auto lg:mx-0">
                <div className="bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-0.5 sm:mb-1">70%</div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 font-semibold">Error Reduction</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-0.5 sm:mb-1">100%</div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 font-semibold">Automated</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent mb-0.5 sm:mb-1">
                    <span className="text-base sm:text-xl lg:text-2xl">Real</span>
                  </div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 font-semibold">-Time</div>
                </div>
              </div>
            </div>

            {/* Right Content - Image (Desktop Only) */}
            <div className="hidden lg:flex relative h-[350px] items-center justify-center animate-slide-up lg:order-2" style={{ animationDelay: '0.2s' }}>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur-[60px] opacity-15 animate-pulse"></div>
              
              {/* Floating Image with 3D Effect */}
              <div className="relative w-full max-w-xs sm:max-w-sm mx-auto animate-float group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl md:rounded-3xl transform rotate-6 scale-105 group-hover:rotate-12 transition-transform duration-500"></div>
                <img 
                  src="/HomeTransImag.png" 
                  alt="ML-Powered Manufacturing Platform" 
                  className="relative w-full h-auto drop-shadow-2xl transform group-hover:scale-105 transition-all duration-700 rounded-xl md:rounded-2xl"
                />
                {/* Decorative Elements - Hidden on small mobile */}
                <div className="hidden sm:block absolute -top-2 md:-top-3 -right-2 md:-right-3 w-12 h-12 md:w-16 md:h-16 bg-primary-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
                <div className="hidden sm:block absolute -bottom-2 md:-bottom-3 -left-2 md:-left-3 w-16 h-16 md:w-20 md:h-20 bg-accent-500 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator - Hidden on mobile */}
          <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
              <span className="text-xs text-gray-500 font-semibold group-hover:text-primary-600 transition-colors">Explore Features</span>
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Image Section - Only visible on mobile */}
      <section className="lg:hidden py-8 px-4 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto max-w-lg">
          <div className="relative h-[250px] sm:h-[300px] md:h-[350px] flex items-center justify-center animate-slide-up">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur-[60px] opacity-15 animate-pulse"></div>
            
            {/* Floating Image with 3D Effect */}
            <div className="relative w-full max-w-xs sm:max-w-sm mx-auto animate-float group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl transform rotate-6 scale-105 group-hover:rotate-12 transition-transform duration-500"></div>
              <img 
                src="/HomeTransImag.png" 
                alt="ML-Powered Manufacturing Platform" 
                className="relative w-full h-auto drop-shadow-2xl transform group-hover:scale-105 transition-all duration-700 rounded-xl"
              />
              {/* Decorative Elements */}
              <div className="hidden sm:block absolute -top-2 -right-2 w-12 h-12 bg-primary-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
              <div className="hidden sm:block absolute -bottom-2 -left-2 w-16 h-16 bg-accent-500 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
              <span className="gradient-text">Automated Manufacturing</span> Features
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Machine learning platform for transformer manufacturing with automated measurements and real-time error prediction
            </p>
          </div>

          {/* Main Feature Cards - Mobile Optimized Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Feature 1 - CT Manufacturing */}
            <div className="card group hover:scale-105 cursor-pointer transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-3 group-hover:shadow-glow transition-shadow">
                <Gauge className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-gray-800">Current Transformer Production</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                Automated CT manufacturing with burden analysis (5-30VA), accuracy class measurement (0.2-3.0), and ML-powered quality control.
              </p>
              <ul className="space-y-1 sm:space-y-1.5 text-xs text-gray-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary-600 flex-shrink-0" />
                  <span>Automated ratio & phase error testing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary-600 flex-shrink-0" />
                  <span>Multi-load condition validation</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary-600 flex-shrink-0" />
                  <span>20 ML-predicted performance metrics</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 - PT Manufacturing */}
            <div className="card group hover:scale-105 cursor-pointer transition-all duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center mb-3 group-hover:shadow-glow transition-shadow">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-gray-800">Potential Transformer Production</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                Automated PT manufacturing for voltage ratings 11kV-33kV with oil quality analysis and intelligent measurement systems.
              </p>
              <ul className="space-y-1 sm:space-y-1.5 text-xs text-gray-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-accent-600 flex-shrink-0" />
                  <span>Automated error measurement</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-accent-600 flex-shrink-0" />
                  <span>Variable load testing (80-120%)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-accent-600 flex-shrink-0" />
                  <span>6 real-time error predictions</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 - ML Analysis */}
            <div className="card group hover:scale-105 cursor-pointer transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:shadow-glow transition-shadow">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-gray-800">Random Forest Error Prediction</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                Machine learning models trained on production datasets predict manufacturing errors and optimize quality control processes.
              </p>
              <ul className="space-y-1 sm:space-y-1.5 text-xs text-gray-600">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary-600 flex-shrink-0" />
                  <span>70% reduction in manual errors</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary-600 flex-shrink-0" />
                  <span>Real-time quality predictions</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary-600 flex-shrink-0" />
                  <span>Automated performance optimization</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Additional Features Grid - Mobile Optimized */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12">
            <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-gradient-to-br from-primary-50 to-white rounded-lg border border-primary-100 hover:shadow-lg transition-shadow">
              <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-600 mb-1.5 sm:mb-2" />
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5 sm:mb-1">Automated Measurements</h4>
              <p className="text-[10px] sm:text-xs text-gray-600">Real-time measurement systems</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-gradient-to-br from-accent-50 to-white rounded-lg border border-accent-100 hover:shadow-lg transition-shadow">
              <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-accent-600 mb-1.5 sm:mb-2" />
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5 sm:mb-1">3D Visualization</h4>
              <p className="text-[10px] sm:text-xs text-gray-600">Interactive data metrics</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-gradient-to-br from-primary-50 to-white rounded-lg border border-primary-100 hover:shadow-lg transition-shadow">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-600 mb-1.5 sm:mb-2" />
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5 sm:mb-1">Quality Control</h4>
              <p className="text-[10px] sm:text-xs text-gray-600">Automated validation</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 sm:p-4 bg-gradient-to-br from-accent-50 to-white rounded-lg border border-accent-100 hover:shadow-lg transition-shadow">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-accent-600 mb-1.5 sm:mb-2" />
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5 sm:mb-1">Production Reports</h4>
              <p className="text-[10px] sm:text-xs text-gray-600">Automated documentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Workflow Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
              Manufacturing <span className="gradient-text">Workflow</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 px-4">Automated production process with ML-powered quality control</p>
          </div>

          {/* Workflow Steps - Mobile-First Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {/* Step 1 */}
            <div className="relative">
              <div className="card text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold mx-auto mb-3 shadow-glow">
                  1
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 text-gray-900">Input Parameters</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Enter transformer specifications: voltage rating, CT ratio, burden, accuracy class for production setup</p>
              </div>
              {/* Desktop Arrow */}
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-primary-400" />
              </div>
              {/* Mobile Arrow */}
              <div className="lg:hidden flex justify-center my-2">
                <ArrowRight className="w-6 h-6 text-primary-400 rotate-90" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="card text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold mx-auto mb-3 shadow-glow">
                  2
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 text-gray-900">Automated Testing</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Automated measurement systems collect ratio errors, phase errors, and performance data in real-time</p>
              </div>
              {/* Desktop Arrow */}
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-primary-400" />
              </div>
              {/* Mobile Arrow */}
              <div className="lg:hidden flex justify-center my-2 sm:hidden">
                <ArrowRight className="w-6 h-6 text-primary-400 rotate-90" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="card text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold mx-auto mb-3 shadow-glow">
                  3
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 text-gray-900">ML Error Prediction</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Random Forest models predict manufacturing errors at multiple load conditions for quality optimization</p>
              </div>
              {/* Desktop Arrow */}
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-primary-400" />
              </div>
              {/* Mobile Arrow */}
              <div className="lg:hidden flex justify-center my-2">
                <ArrowRight className="w-6 h-6 text-primary-400 rotate-90" />
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="card text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-bold mx-auto mb-3 shadow-glow">
                  4
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 text-gray-900">Reports & Analytics</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Interactive 3D visualization, production analytics, and automated documentation generation</p>
              </div>
            </div>
          </div>

          {/* Technical Note - Mobile Optimized */}
          <div className="mt-8 sm:mt-10 md:mt-12 max-w-3xl mx-auto p-4 sm:p-5 md:p-6 bg-white rounded-lg sm:rounded-xl border-2 border-primary-200">
            <div className="flex items-start gap-3 sm:gap-4">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 flex-shrink-0 mt-0.5 sm:mt-1" />
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 sm:mb-2">ML-Powered Quality Control</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Built using Random Forest algorithms trained on real manufacturing data. The platform automates transformer measurements 
                  and predicts potential errors before they occur, reducing manual errors by 70% in production environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="card bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white text-center py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 hover:shadow-glow-lg transition-shadow">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Ready to Automate Your Manufacturing?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-2">
              Join transformer manufacturers using TransformerGO for ML-powered quality control and 70% error reduction
            </p>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 bg-white text-primary-600 font-bold rounded-lg text-base sm:text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 min-w-[200px] sm:min-w-0"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;