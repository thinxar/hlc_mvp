import { APDocumentView } from './APDocumentView'
import { APPolicyListGrid } from './APPolicyListGrid'

const APPolicyViewPage = () => {
  return (
    <div className="flex h-100vh gap-4 p-3">

      <div className="w-[15%] bg-blue-50 rounded-lg p-3">
        <APPolicyListGrid pageName="" type="and" />
      </div>

      <div className="w-[85%] bg-white rounded-lg p-3 shadow">
        <APDocumentView />
      </div>
    </div>

  )
}

export { APPolicyViewPage }
