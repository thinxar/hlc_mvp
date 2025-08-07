import type { IEndPoint } from "@palmyralabs/palmyra-wire"

interface IPageApiRef {
    restApi: IEndPoint
    lookup?: Record<string, IEndPoint>,
}

interface IServerApiConfig extends IPageApiRef {

}

const ServiceEndpoint = {
    baseUrl: '',
    login: {
        loginApi: '/api/auth/login'
    },
    policy: {
        searchPolicyApi: '/policy/dms/{policyNumber}'
    }
}

export { ServiceEndpoint }

export type { IPageApiRef, IServerApiConfig }