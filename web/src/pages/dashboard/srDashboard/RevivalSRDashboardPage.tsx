import { useState } from "react";
import { SRDashboardHeader } from "./SRDashboardHeader";

// const CHART_HEIGHT = '450';
const RevivalSRDashboardPage = () => {
  const [_filter, setFilter] = useState({ branch: '', division: '' });

  // const endpoint = '/sdf';
  return (
    <div className="p-4 bg-slate-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow mb-3 py-1">
        <SRDashboardHeader setFilter={setFilter} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-3">


      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 mt-3">


      </div>

    </div>
  )
}

export { RevivalSRDashboardPage }

