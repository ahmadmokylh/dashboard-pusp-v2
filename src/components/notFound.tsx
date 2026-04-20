import React from 'react'
import { LayoutDashboard, ArrowLeft, Search, FileQuestion } from 'lucide-react'

const DashboardNotFound: React.FC = () => {
  return (
    // Note: Removed 'min-h-screen' so it fits naturally inside your dashboard layout panel
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-4 py-12 text-center">
      {/* Icon Graphic */}
      <div className="bg-blue-50 p-6 rounded-full mb-6">
        <FileQuestion className="w-16 h-16 text-blue-600" strokeWidth={1.5} />
      </div>

      {/* Header */}
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          We couldn't find this view
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          The resource, record, or page you are trying to access doesn't exist,
          or you might not have the correct permissions to view it.
        </p>
      </div>

      {/* Action Area */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-200 focus:outline-none">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 rounded-lg text-white text-sm font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none shadow-sm">
          <LayoutDashboard className="w-4 h-4" />
          Overview
        </button>
      </div>

      {/* Contextual Help / Search Prompt */}
      <div className="mt-10 p-4 bg-slate-50 rounded-xl border border-slate-100 max-w-md w-full flex items-start gap-3 text-left">
        <Search className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-slate-900">
            Looking for a specific record?
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Try using the global search bar at the top of your screen, or check
            your recent items menu.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardNotFound
