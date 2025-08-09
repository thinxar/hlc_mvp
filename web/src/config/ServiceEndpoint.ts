import type { IEndPoint } from "@palmyralabs/palmyra-wire"

interface IPageApiRef {
    restApi: IEndPoint
    lookup?: Record<string, IEndPoint>,
}

interface IServerApiConfig extends IPageApiRef {

}

const ServiceEndpoint = {
    baseUrl: '',
    auth: {
        login: '/api/auth/login',
        logout: '/auth/logout',
    },
    policy: {
        searchPolicyApi: '/policy',
        searchPolicyByIdApi: '/policy/{policyId}/file',
        getFileApi: '/policy/{policyId}/file/{fileId}',
        fileUploadApi: '/policy/{policyId}/file'
    }
}

export { ServiceEndpoint }

export type { IPageApiRef, IServerApiConfig }