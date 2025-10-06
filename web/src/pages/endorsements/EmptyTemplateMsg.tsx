import React from 'react';
import { BiXCircle } from 'react-icons/bi';
import { IoAlertOutline } from 'react-icons/io5';

export const ErrorDisplay = ({ endorsementTitle, code, type = 'invalid' }: any) => {
    const errorConfig: any = {
        invalid: {
            icon: <BiXCircle className="w-12 h-12 text-red-500" />,
            title: 'Invalid Format',
            message: `The endorsement title format is invalid`,
            detail: endorsementTitle,
            bgGradient: 'from-red-50 to-red-100',
            borderColor: 'border-red-200',
            textColor: 'text-red-800'
        },
        notfound: {
            icon: <IoAlertOutline className="w-12 h-12 text-amber-500" />,
            title: 'Template Not Found',
            message: `No template available for this endorsement`,
            detail: code,
            bgGradient: 'from-amber-50 to-amber-100',
            borderColor: 'border-amber-200',
            textColor: 'text-amber-800'
        }
    };

    const config: any = errorConfig[type];

    return (
        <div className="flex items-center justify-center p-4">
            <div className={`bg-gradient-to-br ${config.bgGradient} border-2 ${config.borderColor} rounded-2xl shadow-lg max-w-md w-full overflow-hidden`}>
                <div className="p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="animate-pulse">
                            {config.icon}
                        </div>

                        <h3 className={`text-2xl font-bold ${config.textColor}`}>
                            {config.title}
                        </h3>

                        <p className="text-gray-700 text-base">
                            {config.message}
                        </p>

                        <div className="w-full bg-white bg-opacity-60 rounded-lg p-2 border border-gray-200">
                            <code className="text-sm text-gray-600 break-all font-mono">
                                {config.detail}
                            </code>
                        </div>
                    </div>
                </div>

                <div className={`h-2 bg-gradient-to-r ${config.bgGradient}`}></div>
            </div>
        </div>
    );
};

const ExampleModal = () => {
    const [errorType, setErrorType] = React.useState('invalid');

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Error Type Preview</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setErrorType('invalid')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${errorType === 'invalid'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Invalid Format
                        </button>
                        <button
                            onClick={() => setErrorType('notfound')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${errorType === 'notfound'
                                ? 'bg-amber-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Template Not Found
                        </button>
                    </div>
                </div>

                {errorType === 'invalid' && (
                    <ErrorDisplay
                        endorsementTitle="INVALID-FORMAT-123"
                        type="invalid"
                    />
                )}

                {errorType === 'notfound' && (
                    <ErrorDisplay
                        code="XYZ-999"
                        type="notfound"
                    />
                )}
            </div>
        </div>
    );
};

export default ExampleModal;