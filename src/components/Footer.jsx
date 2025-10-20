import { Link } from 'react-router-dom';
import { FileText, BookOpen, Shield, Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="gradient-text">Transformer</span>
              <span className="text-white">GO</span>
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              ML-powered manufacturing automation platform for transformer production. 
              Trusted by manufacturers worldwide for quality control and error prediction.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Technical Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-500" />
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Technical Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Manufacturing Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  ML Model Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  User Guides & Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* ML & Manufacturing */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent-500" />
              Manufacturing
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Random Forest Models
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Quality Control Systems
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Production Analytics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Automated Measurements
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Error Prediction
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary-500" />
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-accent-500 flex-shrink-0" />
                <span className="text-sm">
                  Engineering Solutions Hub<br />
                  Technology Park, Innovation District
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-500" />
                <a href="tel:+1234567890" className="hover:text-primary-400 transition-colors text-sm">
                  +1 (234) 567-8900
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-500" />
                <a href="mailto:support@transformergo.com" className="hover:text-primary-400 transition-colors text-sm">
                  support@transformergo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} TransformerGO. All rights reserved. | ML-Powered Manufacturing Solutions
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-primary-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Built for manufacturers | Random Forest error prediction | 70% reduction in manual errors
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
