import { TemplateOtherEndorsement } from "src/endorsementsTemplate/anyOther/TemplateOtherEndorsement";
import { Template5250 } from "src/endorsementsTemplate/assignment/Template5250";
import { TemplateRegistration } from "src/endorsementsTemplate/nomination/TemplateRegistration";
import { Template5093 } from "src/endorsementsTemplate/surrender/Template5093";
import { Template5216 } from "src/endorsementsTemplate/surrender/Template5216";
import { TemplateUlip } from "src/endorsementsTemplate/surrender/TemplateUlip";
export interface TemplateEntry {
    editor: React.FC<any>;
    viewer?: React.FC<any>;
}

export const templateMap: Record<string, TemplateEntry> = {
    "5093": { editor: Template5093, viewer: Template5093 },
    "5094": { editor: Template5093, viewer: Template5093 },
    "5095": { editor: Template5093, viewer: Template5093 },
    "5216": { editor: Template5216, viewer: Template5216 },
    "ulip": { editor: TemplateUlip, viewer: TemplateUlip },
    "otherEndorse": { editor: TemplateOtherEndorsement, viewer: TemplateOtherEndorsement },
    "5250": { editor: Template5250, viewer: Template5250 },
    "nomination": { editor: TemplateRegistration, viewer: TemplateRegistration },
};

