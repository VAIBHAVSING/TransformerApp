import { Info } from 'lucide-react';
import { useState } from 'react';

/**
 * FieldTooltip Component
 * Displays helpful engineering information for form fields
 */
const FieldTooltip = ({ title, content, technical }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="ml-2 text-primary-500 hover:text-primary-600 transition-colors"
        aria-label={`Information about ${title}`}
      >
        <Info className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 mt-2 w-80 p-4 bg-white rounded-lg shadow-2xl border border-gray-200 animate-fade-in">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary-600" />
            {title}
          </h4>
          <p className="text-sm text-gray-600 mb-2">{content}</p>
          {technical && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 italic">
                <strong>Technical:</strong> {technical}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FieldTooltip;
