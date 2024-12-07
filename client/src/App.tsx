import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { detectDisease } from './services/api';

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ disease: string; confidence: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      setResult(null);
      setSelectedImage(URL.createObjectURL(file));

      const response = await detectDisease(file);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Potato Disease Detection
          </h1>
          <p className="text-lg text-gray-600">
            Upload a photo of your potato plant and we'll analyze it for diseases
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
            <ResultDisplay result={result} error={error} />
          </div>

          {/* Preview Section */}
          <div className="rounded-lg overflow-hidden bg-white shadow-lg">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected potato plant"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full min-h-[300px] flex items-center justify-center bg-gray-100">
                <p className="text-gray-500 text-center px-4">
                  Your uploaded image will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;