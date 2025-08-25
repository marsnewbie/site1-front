"use client";
import { useState, useEffect } from 'react';

export default function TestPage() {
  const [menuData, setMenuData] = useState(null);
  const [storeConfig, setStoreConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function testAPIs() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://site1-backend-production.up.railway.app';
        
        // Test menu API
        console.log('Testing menu API...');
        const menuRes = await fetch(apiUrl + '/api/menu');
        if (menuRes.ok) {
          const menuData = await menuRes.json();
          setMenuData(menuData);
          console.log('Menu API success:', menuData);
        } else {
          console.error('Menu API failed:', menuRes.status);
        }

        // Test store config API
        console.log('Testing store config API...');
        const configRes = await fetch(apiUrl + '/api/store/config');
        if (configRes.ok) {
          const configData = await configRes.json();
          setStoreConfig(configData);
          console.log('Store config API success:', configData);
        } else {
          console.error('Store config API failed:', configRes.status);
        }

      } catch (e) {
        console.error('API test error:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    testAPIs();
  }, []);

  if (loading) {
    return <div className="p-8">Testing APIs...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Results</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Menu API</h2>
          {menuData ? (
            <div>
              <p className="text-green-600">✅ Success</p>
              <p>Categories: {menuData.categories?.length || 0}</p>
              <p>Items: {menuData.items?.length || 0}</p>
              <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(menuData, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-red-600">❌ Failed</p>
          )}
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Store Config API</h2>
          {storeConfig ? (
            <div>
              <p className="text-green-600">✅ Success</p>
              <p>Store: {storeConfig.name}</p>
              <p>Collection time: {storeConfig.collection_lead_time_minutes}min</p>
              <p>Delivery time: {storeConfig.delivery_lead_time_minutes}min</p>
              <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(storeConfig, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-red-600">❌ Failed</p>
          )}
        </div>
      </div>
    </div>
  );
}
