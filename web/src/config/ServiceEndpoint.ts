import type { IEndPoint } from "@palmyralabs/palmyra-wire"

interface IPageApiRef {
    restApi: IEndPoint
    lookup?: Record<string, IEndPoint>,
}

interface IServerApiConfig extends IPageApiRef {

}

const ServiceEndpoint = {
    baseUrl: '',
    BASE_URL: 'http://localhost:5000/api/palmyra',
    auth: {
        login: '/api/auth/login',
        logout: '/auth/logout',
    },
    password: {
        resetPwd: "",
        changePwd: ""
    },
    aclmgmt: {
        group: '',
        menuApi: {
            aclPutMenuEditorApi: '',
            aclMenuEditorApi: '',
            lookup: {
                menuApi: ''
            }
        },
        groupsByUser: {
            restApi: '',
            deleteApi: '',
            lookup: {
                restApi: ''
            }
        },
        usersByGroup: {
            restApi: '/admin/acl/user/{userId}/groups',
            deleteApi: '/admin/acl/user/{userId}/group/{groupId}',
            lookup: {
                restApi: '/admin/acl/user/{userId}/groups/lookup'
            }
        },
    },
    userManagement: {
        users: {
            restApi: '/userManagement'
        },
        usersById: {
            restApi: '/userManagement/{id}'
        }
    },
    policy: {
        searchPolicyApi: '/policy',
        searchPolicyByIdApi: '/policy/{policyId}/file',
        getFileApi: '/policy/{policyId}/file/{fileId}/download',
        getFileDetailApi: '/policy/{policyId}/file/{fileId}',
        fileUploadApi: '/policy/{policyId}/docketType/{docketTypeId}/file',
        endorsement: {
            endorseCreateApi: '/policy/{policyId}/endorsement/{docketType}',
            summary: '/policy/{policyId}/endorsement/summary'
        },
        stamp: {
            lookup: '/masterdata/fixedStamp',
            stampUploadApi: '/policy/policyFile/fixedStamp'
        }
    },
    lookup: {
        docketType: '/masterdata/docketType',
        endorsementType: '/masterdata/endorsementType',
        endorsementSubType: '/masterdata/{endorsementType}/endorsementSubType',
        userType: '',
        designation: ''
    }
}

export { ServiceEndpoint }

export type { IPageApiRef, IServerApiConfig }