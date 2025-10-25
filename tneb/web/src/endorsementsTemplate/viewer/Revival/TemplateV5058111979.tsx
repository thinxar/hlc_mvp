import { TextView } from 'templates/mantineForm'; import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5058111979 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" border={1}>
        <th>
          <h5 className="text-right">Form No.5058A</h5>
          <h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
          <h5 className="text-center"><u>FORM OF ENDORSEMENT TO BE USED IN RESPECT OF POLICIES ORIGINALLY ISSUED PRIOR TO 1.1.1979</u></h5>
          <table width="600">
            <tr>
              <td width="40"></td>
              <td width="535">
                <p className="text-center">Form of Endorsement to be used in respect of Policies where there is change in the Rate of Interest.</p>
                <p className="text-justify"><i>Notes:</i> 1.This form does not apply in the case of Polices issued under Table 43(Two Year Temporary Assurance) and in the case of Table 58 (Convertible Term Assurance) </p></td>
              <td width="40"></td>
            </tr>
          </table>
          <br />
          <br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td width="250" align="left"> Place:<TextView attribute="branchName" /> </td>
              <td width="300" align="right"> Date:<TextView attribute="currDate" /> </td>
              <td width="25"></td>
            </tr>
          </table>
          <br />
          <br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td width="550" align="left"><p className="text-justify"> 1. It is hereby declared that the within written Policy which lapsed by non-payment of the premium Due<TextView attribute="value3" /> is revived under the Special Revival Scheme at the request of the within-named Life Assured made to the Corporation on<TextView attribute="value4" /> that the risk under the withinmentioned Policy so revived has been commenced on<TextView attribute="value5" /> and that the premium has been charged for age<TextView attribute="value6" /> years and will be payable at the enhanced rate of Rs.<TextView attribute="value7" /> from<TextView attribute="value8" /> to<TextView attribute="value9" /> inclusive for a period<TextView attribute="value10" /> years instead of<TextView attribute="value11" /> as within mentioned.*Consequently this policy shall mature on<TextView attribute="value12" /> instead of<TextView attribute="value13" /> as withinmentioned. It is further declared that together with the proposal and Declaration for Assurance and the statements contained and referred to therein the statements made by the Assured in the Personal Statement regarding Health completed by the Assured for Revival will form the basis of this assurance. </p></td>
              <td width="25"></td>
            </tr>
          </table>
          <br />
          <table>
            <tr>
              <td width="25"></td>
              <td width="550" >
                <p className="text-justify">2. Condition/s re:<TextView attribute="value14" /> as appearing on the Policy is/are altered as under: </p></td>
              <td width="25"></td>
            </tr>
          </table>
          <br />
          <table>
            <tr>
              <td width="25"></td>
              <td width="550"><p className="text-justify"> (Here mention the new modified condition/s as made applicable to the policy after Special Revival) </p></td>
              <td width="25"></td>
            </tr>
          </table>
          <br />
          <br />
          <br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td width="550" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
              <td width="25"></td>
            </tr>
          </table>
          <br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td width="550" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
              <td width="25"></td>
            </tr>
          </table>
          <table width="600">
            <tr>
              <td width="25"></td>
              <td width="550" align="left">
                <i>Note: </i> *(Applies to endowment of policy only) </td>
            </tr>
          </table>
          <br />
          <br />
        </th>
      </table>
    </PalmyraForm>
  );
};

export { TemplateV5058111979 };
