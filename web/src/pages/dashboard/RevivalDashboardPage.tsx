import { useState } from "react";
import { CaseOverviewCard } from "./card/CaseOverviewCard"

const RevivalDashboardPage = () => {
  const [filter, _setFilter] = useState({ branch: '' });
  
  return (
    <div>
      <CaseOverviewCard title="Resource Overview" endPoint={"resourceCardApi"}
        filter={filter} />
    </div>
  )
}

export { RevivalDashboardPage }

