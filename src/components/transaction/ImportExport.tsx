import React, { useState, useRef } from 'react';
import { Download, Upload, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { exportData, importData } from '../../utils/storage';
import { downloadJSON, exportToCSV, downloadCSV } from '../../utils/helpers';

const ImportExport: React.FC = () => {
  const { transactions } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportType, setExportType] = useState<'json' | 'csv'>('json');

  const handleExport = async () => {
    try {
      if (exportType === 'json') {
        const data = await exportData();
        downloadJSON(data, `expense-tracker-export-${new Date().toISOString().split('T')[0]}.json`);
      } else {
        const csvData = exportToCSV(transactions);
        downloadCSV(csvData, `expense-tracker-export-${new Date().toISOString().split('T')[0]}.csv`);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      await importData(fileContent);
      setImportStatus('success');
      
      // Reset status after a delay
      setTimeout(() => {
        setImportStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Import error:', error);
      setImportStatus('error');
      
      // Reset status after a delay
      setTimeout(() => {
        setImportStatus('idle');
      }, 3000);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Import & Export</h2>
      
      <div className="space-y-8">
        {/* Export Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Export Your Data</h3>
          <p className="text-gray-500 mb-4">
            Download your transaction history as a file that you can back up or import later.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="flex space-x-3">
              <button
                onClick={() => setExportType('json')}
                className={`px-4 py-2 rounded-lg border ${
                  exportType === 'json'
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                JSON Format
              </button>
              <button
                onClick={() => setExportType('csv')}
                className={`px-4 py-2 rounded-lg border ${
                  exportType === 'csv'
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                CSV Format
              </button>
            </div>
            
            <button
              onClick={handleExport}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} className="mr-2" />
              Export {exportType.toUpperCase()}
            </button>
          </div>
        </div>
        
        {/* Import Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Import Data</h3>
          <p className="text-gray-500 mb-4">
            Import previously exported data to restore your transactions.
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleImportClick}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Upload size={18} className="mr-2" />
              Select JSON File
            </button>
            
            {importStatus === 'success' && (
              <div className="flex items-center text-green-600">
                <Check size={18} className="mr-1" />
                <span>Import successful!</span>
              </div>
            )}
            
            {importStatus === 'error' && (
              <div className="flex items-center text-rose-600">
                <AlertCircle size={18} className="mr-1" />
                <span>Import failed. Please check your file format.</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Note on Data Security */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-700 mb-2">Your Data Privacy</h4>
          <p className="text-sm text-blue-600">
            All your financial data is stored locally on your device and is never sent to our servers 
            without your explicit permission. Regular exports are recommended for data backup.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;