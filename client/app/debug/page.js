"use client";
import APITest from '../../components/debug/APITest';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Debug & Test Page</h1>
        <APITest />
      </div>
    </div>
  );
}