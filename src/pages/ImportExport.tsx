import React from 'react';
import { AlertTriangle } from 'lucide-react';
import ImportExportComponent from '../components/transaction/ImportExport';

const ImportExportPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Import & Export</h1>
      
      <ImportExportComponent />
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Privacy & Backup</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">How Your Data Is Stored</h3>
            <p className="text-gray-600">
              All your transaction data is stored locally on your device using IndexedDB technology. 
              This means your financial information never leaves your device unless you explicitly
              export or back it up.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Recommended Backup Schedule</h3>
            <p className="text-gray-600 mb-4">
              We recommend regular backups of your financial data to prevent any loss:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Export data at least once a month</li>
              <li>Export after entering large batches of transactions</li>
              <li>Save backups in multiple locations (cloud storage, external drive)</li>
              <li>Consider our Pro plan for automated daily Google Drive backups</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">What Happens If You Clear Browser Data</h3>
            <div className="p-3 bg-amber-50 rounded-lg text-amber-800 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="mt-0.5 mr-2 flex-shrink-0" size={18} />
                <p>
                  Clearing your browser's cache or storage may delete all your transaction data. 
                  Always export a backup before clearing browser data or switching devices.
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              If you accidentally clear your data, you can restore it by importing your most recent backup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportPage;