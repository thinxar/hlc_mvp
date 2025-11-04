import {
    Template1,
    Template10,
    Template111, Template149, Template150, Template179, Template2, Template3, Template3543, Template3544,
    Template3546, Template3551, Template3552, Template3553, Template3554, Template3555, Template3559, Template3560, Template3561, Template3562,
    Template3567, Template3568, Template3579, Template3711, Template3728, Template3729, Template3730, Template3731, Template3732, Template3733,
    Template3734, Template3735, Template3736, Template3773, Template3774, Template3775, Template3896, Template3897, Template4, Template5, Template5042, Template5042103,
    Template5042168, Template5042192090, Template504290, Template5042901, Template5043, Template50431, Template5058, Template5058111979, Template5059,
    Template5093, Template5094, Template5095, Template5146, Template5184, Template5185, Template5197,
    Template5200, Template5208, Template5213, Template5216, Template5241, Template52411, Template52455244, Template52475246, Template52495248,
    Template5250, Template52535252, Template5254, Template52585256, Template5259, Template6, Template60000, Template600001, Template7, Template8, Template801,
    Template9,
    TemplateForeclosureofPolicy, TemplateForeignPolicy, TemplateMaturityJeevanDhara, TemplateMaturityJeevanSuraksha, TemplateOtherEndorsement,
    TemplateRegistrationofAssignment, TemplateRegistrationofNomination, TemplateReinstatementofforeclosedpolicy, TemplateSurrenderofULIPpolicywithinlockingperiod
} from "src/endorsementsTemplate/editor";
import {
    TemplateV111, TemplateV149, TemplateV150, TemplateV179, TemplateV3543, TemplateV3544, TemplateV3546, TemplateV3551, TemplateV3552,
    TemplateV3553, TemplateV3554, TemplateV3555, TemplateV3559, TemplateV3560, TemplateV3561, TemplateV3562, TemplateV3567, TemplateV3568,
    TemplateV3579, TemplateV3711, TemplateV3728, TemplateV3729, TemplateV3730, TemplateV3731, TemplateV3732, TemplateV3733, TemplateV3734,
    TemplateV3735, TemplateV3736, TemplateV3773, TemplateV3774, TemplateV3775, TemplateV3896, TemplateV3897, TemplateV5042, TemplateV5042103,
    TemplateV5042168, TemplateV5042192090, TemplateV504290, TemplateV5042901, TemplateV5043, TemplateV50431, TemplateV5058, TemplateV5058111979, TemplateV5059, TemplateV5093, TemplateV5094, TemplateV5095, TemplateV5146, TemplateV5184, TemplateV5185, TemplateV5197, TemplateV5200, TemplateV5208, TemplateV5213, TemplateV5216, TemplateV5241, TemplateV52411, TemplateV52455244, TemplateV52475246, TemplateV52495248, TemplateV5250, TemplateV52535252, TemplateV5254, TemplateV52585256, TemplateV5259, TemplateV60000, TemplateV600001, TemplateV801, TemplateVForeclosureofPolicy, TemplateVForeignPolicy, TemplateVMaturityJeevanDhara, TemplateVMaturityJeevanSuraksha, TemplateVOtherEndorsement, TemplateVRegistrationofAssignment, TemplateVRegistrationofNomination, TemplateVReinstatementofforeclosedpolicy, TemplateVSurrenderofULIPpolicywithinlockingperiod
} from "src/endorsementsTemplate/viewer";
import { TemplateV1 } from "src/endorsementsTemplate/viewer/Endorsement1/TemplateV1";
import { TemplateV2 } from "src/endorsementsTemplate/viewer/Endorsement1/TemplateV2";
import { TemplateV3 } from "src/endorsementsTemplate/viewer/Endorsement2/TemplateV3";
import { TemplateV4 } from "src/endorsementsTemplate/viewer/Endorsement2/TemplateV4";
import { TemplateV5 } from "src/endorsementsTemplate/viewer/Endorsement3/TemplateV5";
import { TemplateV6 } from "src/endorsementsTemplate/viewer/Endorsement3/TemplateV6";
import { TemplateV7 } from "src/endorsementsTemplate/viewer/Endorsement4/TemplateV7";
import { TemplateV8 } from "src/endorsementsTemplate/viewer/Endorsement4/TemplateV8";
import { TemplateV10 } from "src/endorsementsTemplate/viewer/Endorsement5/TemplateV10";
import { TemplateV9 } from "src/endorsementsTemplate/viewer/Endorsement5/TemplateV9";

export interface TemplateEntry {
    editor: React.FC<any>;
    viewer?: React.FC<any>;
}

export const templateMap: Record<string, TemplateEntry> = {
    "5093": { editor: Template5093, viewer: TemplateV5093 },
    "5094": { editor: Template5094, viewer: TemplateV5094 },
    "5095": { editor: Template5095, viewer: TemplateV5095 },
    "5216": { editor: Template5216, viewer: TemplateV5216 },
    "ulip": { editor: TemplateSurrenderofULIPpolicywithinlockingperiod, viewer: TemplateVSurrenderofULIPpolicywithinlockingperiod },
    "otherEndorse": { editor: TemplateOtherEndorsement, viewer: TemplateVOtherEndorsement },
    "registration of nomination": { editor: TemplateRegistrationofNomination, viewer: TemplateVRegistrationofNomination },
    "5197": { editor: Template5197, viewer: TemplateV5197 },
    "5200": { editor: Template5200, viewer: TemplateV5200 },
    "5208": { editor: Template5208, viewer: TemplateV5208 },
    "5213": { editor: Template5213, viewer: TemplateV5213 },
    "foreClosure of policy": { editor: TemplateForeclosureofPolicy, viewer: TemplateVForeclosureofPolicy },
    "reInstatement  ": { editor: TemplateReinstatementofforeclosedpolicy, viewer: TemplateVReinstatementofforeclosedpolicy },
    "revival no change": { editor: Template5058, viewer: TemplateV5058 },
    "5059": { editor: Template5059, viewer: TemplateV5059 },
    "5184": { editor: Template5184, viewer: TemplateV5184 },
    "Endorsement Plus": { editor: Template5241, viewer: TemplateV5241 },
    "Riders": { editor: Template52411, viewer: TemplateV52411 },
    "policies issued": { editor: Template5058111979, viewer: TemplateV5058111979 },
    "5250": { editor: Template5250, viewer: TemplateV5250 },
    "registration of assignment": { editor: TemplateRegistrationofAssignment, viewer: TemplateVRegistrationofAssignment },
    "3543": { editor: Template3543, viewer: TemplateV3543 },
    "3544": { editor: Template3544, viewer: TemplateV3544 },
    "3546": { editor: Template3546, viewer: TemplateV3546 },
    "3551": { editor: Template3551, viewer: TemplateV3551 },
    "3552": { editor: Template3552, viewer: TemplateV3552 },
    "3553": { editor: Template3553, viewer: TemplateV3553 },
    "3554": { editor: Template3554, viewer: TemplateV3554 },
    "3555": { editor: Template3555, viewer: TemplateV3555 },
    "3559": { editor: Template3559, viewer: TemplateV3559 },
    "3560": { editor: Template3560, viewer: TemplateV3560 },
    "3561": { editor: Template3561, viewer: TemplateV3561 },
    "3562": { editor: Template3562, viewer: TemplateV3562 },
    "3567": { editor: Template3567, viewer: TemplateV3567 },
    "3568": { editor: Template3568, viewer: TemplateV3568 },
    "3579": { editor: Template3579, viewer: TemplateV3579 },
    "3711": { editor: Template3711, viewer: TemplateV3711 },
    "3728": { editor: Template3728, viewer: TemplateV3728 },
    "3729": { editor: Template3729, viewer: TemplateV3729 },
    "3730": { editor: Template3730, viewer: TemplateV3730 },
    "3731": { editor: Template3731, viewer: TemplateV3731 },
    "3732": { editor: Template3732, viewer: TemplateV3732 },
    "3733": { editor: Template3733, viewer: TemplateV3733 },
    "3734": { editor: Template3734, viewer: TemplateV3734 },
    "3735": { editor: Template3735, viewer: TemplateV3735 },
    "3736": { editor: Template3736, viewer: TemplateV3736 },
    "3773": { editor: Template3773, viewer: TemplateV3773 },
    "3774": { editor: Template3774, viewer: TemplateV3774 },
    "3775": { editor: Template3775, viewer: TemplateV3775 },
    "3896": { editor: Template3896, viewer: TemplateV3896 },
    "3897": { editor: Template3897, viewer: TemplateV3897 },
    "5042-waive of future premuim": { editor: Template5042, viewer: TemplateV5042 },
    "5043": { editor: Template5043, viewer: TemplateV5043 },
    "5185": { editor: Template5185, viewer: TemplateV5185 },
    "5254": { editor: Template5254, viewer: TemplateV5254 },
    "5259": { editor: Template5259, viewer: TemplateV5259 },
    "5245": { editor: Template52455244, viewer: TemplateV52455244 },
    "5247": { editor: Template52475246, viewer: TemplateV52475246 },
    "5249": { editor: Template52495248, viewer: TemplateV52495248 },
    "5253": { editor: Template52535252, viewer: TemplateV52535252 },
    "5258": { editor: Template52585256, viewer: TemplateV52585256 },
    "foreignPolicy": { editor: TemplateForeignPolicy, viewer: TemplateVForeignPolicy },
    "Plan 111": { editor: Template111, viewer: TemplateV111 },
    "Plan 149": { editor: Template149, viewer: TemplateV149 },
    "Plan 150": { editor: Template150, viewer: TemplateV150 },
    "Plan 179": { editor: Template179, viewer: TemplateV179 },
    "Plan 801": { editor: Template801, viewer: TemplateV801 },
    "50431": { editor: Template50431, viewer: TemplateV50431 },
    "5146": { editor: Template5146, viewer: TemplateV5146 },
    "benefit-more than": { editor: Template600001, viewer: TemplateV600001 },
    "benefit-less than": { editor: Template60000, viewer: TemplateV60000 },
    "5042-A": { editor: Template504290, viewer: TemplateV504290 },
    "5042-B": { editor: Template5042901, viewer: TemplateV5042901 },
    "5042(JC)-jeevan": { editor: Template5042103, viewer: TemplateV5042103 },
    "5042(C)-jeevan": { editor: Template5042168, viewer: TemplateV5042168 },
    "5042-Full": { editor: Template5042192090, viewer: TemplateV5042192090 },
    "jeevanDhara": { editor: TemplateMaturityJeevanDhara, viewer: TemplateVMaturityJeevanDhara },
    "jeevanSuraksha": { editor: TemplateMaturityJeevanSuraksha, viewer: TemplateVMaturityJeevanSuraksha },
    "1": { editor: Template1, viewer: TemplateV1 },
    "2": { editor: Template2, viewer: TemplateV2 },
    "3": { editor: Template3, viewer: TemplateV3 },
    "4": { editor: Template4, viewer: TemplateV4 },
    "5": { editor: Template5, viewer: TemplateV5 },
    "6": { editor: Template6, viewer: TemplateV6 },
    "7": { editor: Template7, viewer: TemplateV7 },
    "8": { editor: Template8, viewer: TemplateV8 },
    "9": { editor: Template9, viewer: TemplateV9 },
    "10": { editor: Template10, viewer: TemplateV10 }

};