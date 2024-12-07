import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ResultDisplayProps {
  result: {
    class: string;
    confidence: number;
  } | null;
  error: string | null;
}

export function ResultDisplay({ result, error }: ResultDisplayProps) {
  if (!result && !error) return null;

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 mt-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="ml-3 text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 mt-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          <h3 className="ml-2 text-lg font-medium text-gray-900">Analysis Result</h3>
        </div>
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
          {(result?.confidence * 100).toFixed(1)}% confident
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">Detected Disease:</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">{result?.class}</p>
      </div>
    </div>
  );
}
