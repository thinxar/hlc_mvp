import { TemplateOtherEndorsement } from "src/endorsementsTemplate/anyOther/TemplateOtherEndorsement";
import { Template5250 } from "src/endorsementsTemplate/assignment/Template5250";
import { TemplateRegistration } from "src/endorsementsTemplate/nomination/TemplateRegistration";
import { Template5093 } from "src/endorsementsTemplate/surrender/Template5093";
import { Template5094 } from "src/endorsementsTemplate/surrender/Template5094";
import { Template5095 } from "src/endorsementsTemplate/surrender/Template5095";
import { Template5216 } from "src/endorsementsTemplate/surrender/Template5216";
import { TemplateUlip } from "src/endorsementsTemplate/surrender/TemplateUlip";

export const templateMap: Record<string, React.FC> = {
    "5093": Template5093,
    "5094": Template5094,
    "5095": Template5095,
    "5216": Template5216,
    "ulip": TemplateUlip,
    "otherEndorse": TemplateOtherEndorsement,
    "5250": Template5250,
    "nomination": TemplateRegistration
};
