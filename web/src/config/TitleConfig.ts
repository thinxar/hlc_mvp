import {
    FiUser,
    FiHash,
    FiFileText,
    FiCalendar,
    FiClock
} from "react-icons/fi";

import { MdVerified, MdPhone } from "react-icons/md";

const TitleConfig = {
    appTitle: {
        text: "Life Insurance Corporation"
    }
}

export { TitleConfig };


export const fieldConfig: any = {

    REV: [
        { label: "Policy No", key: "policyNumber", icon: FiFileText, color: "text-blue-600 bg-blue-50" },
        { label: "Uploaded By", key: "uploadedBy", icon: FiUser, color: "text-green-600 bg-green-50" },
        { label: "Doc Type", key: "docType", icon: FiFileText, color: "text-purple-600 bg-purple-50" },
        { label: "Doc Sub Type", key: "docSubType", icon: FiFileText, color: "text-pink-600 bg-pink-50" },
        { label: "BO Code", key: "boCode", icon: FiHash, color: "text-orange-600 bg-orange-50" },
        { label: "DO Code", key: "doCode", icon: FiHash, color: "text-yellow-600 bg-yellow-50" },
        { label: "SO Code", key: "soCode", icon: FiHash, color: "text-indigo-600 bg-indigo-50" },
    ],

    AND: [
        { label: "Agent Code", key: "agentCode", icon: FiUser, color: "text-blue-600 bg-blue-50" },
        { label: "BO Code", key: "boCode", icon: FiHash, color: "text-orange-600 bg-orange-50" },
        { label: "ACK No", key: "ackNo", icon: MdVerified, color: "text-green-600 bg-green-50" },
        { label: "LA Name", key: "laName", icon: FiUser, color: "text-purple-600 bg-purple-50" },
        { label: "Proposal Type", key: "proposalType", icon: FiFileText, color: "text-pink-600 bg-pink-50" },
        { label: "Proposal No", key: "proposalNo", icon: FiFileText, color: "text-indigo-600 bg-indigo-50" },
        { label: "Year", key: "year", icon: FiCalendar, color: "text-yellow-600 bg-yellow-50" },
        { label: "Plan Code", key: "planCode", icon: FiHash, color: "text-teal-600 bg-teal-50" },
        { label: "Object Submitted On", key: "objectSubmittedOn", icon: FiCalendar, color: "text-cyan-600 bg-cyan-50" },
        { label: "Request time", key: "requestTime", icon: FiClock, color: "text-red-600 bg-red-50" },
        { label: "Process time", key: "processTime", icon: FiClock, color: "text-gray-600 bg-gray-50" },
    ],

    PBV: [
        { label: "Agent Code", key: "agentCode", icon: FiUser, color: "text-blue-600 bg-blue-50" },
        { label: "BO Code", key: "boCode", icon: FiHash, color: "text-orange-600 bg-orange-50" },
        { label: "ACK No", key: "ackNo", icon: MdVerified, color: "text-green-600 bg-green-50" },
        { label: "LA Name", key: "laName", icon: FiUser, color: "text-purple-600 bg-purple-50" },
        { label: "DOB", key: "dob", icon: FiCalendar, color: "text-pink-600 bg-pink-50" },
        { label: "Mobile", key: "mobileNo", icon: MdPhone, color: "text-emerald-600 bg-emerald-50" },
        { label: "Proposal Type", key: "proposalType", icon: FiFileText, color: "text-indigo-600 bg-indigo-50" },
        { label: "Proposal Number", key: "proposalNo", icon: FiFileText, color: "text-violet-600 bg-violet-50" },
        { label: "Policy No", key: "policyNumber", icon: FiFileText, color: "text-blue-600 bg-blue-50" },
        { label: "Year", key: "year", icon: FiCalendar, color: "text-yellow-600 bg-yellow-50" },
    ],

};

