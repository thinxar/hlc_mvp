import { ErrorBoundary, type FallbackProps } from "react-error-boundary"
import { MdRefresh } from "react-icons/md"

const PageWrapper = (props: any) => {
  return (
    <ErrorBoundary
      fallbackRender={(props: FallbackProps) => {
        const errorDetails = `Error: "${props.error}"`;

        return (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-xl shadow-md border border-red-100 overflow-hidden">

              <div className="bg-linear-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">An Error Occurred</h1>
                    <p className="text-red-100 text-sm">Something went wrong while loading this page</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Error Details:</h3>
                  <p className="text-sm text-gray-600 font-mono bg-white p-3 rounded border break-all">
                    {errorDetails}
                  </p>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex-1 cursor-pointer bg-red-500
                     hover:bg-red-600 text-white font-medium py-2 ml-30 mr-30 flex items-center justify-center
                     px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <MdRefresh className="mr-2"/>
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }}
    >
      {props.children}
    </ErrorBoundary>
  )
}

export default PageWrapper