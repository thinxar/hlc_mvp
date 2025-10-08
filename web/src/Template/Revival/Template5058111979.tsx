import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5058111979 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>
<table width="600" border={1}>
<th>
<h5 className="text-right">Form No.5058A</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>FORM OF ENDORSEMENT TO BE USED IN RESPECT OF POLICIES ORIGINALLY ISSUED PRIOR TO 1.1.1979</u></h5>
<table width="600">
<tr>
<td width="40"></td>
<td width="535">
<p className="text-align: center;">Form of Endorsement to be used in respect of Policies where there is change in the Rate of Interest.</p>
<p className="text-align: justify;"><i>Notes:</i> 1.This form does not apply in the case of Polices issued under Table 43(Two Year Temporary Assurance) and in the case of Table 58 (Convertible Term Assurance) </p></td>
<td width="40"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="250" align="left"> Place:<TextField attribute="BranchName" type="text" /> </td>
<td width="300" align="right"> Date: <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;"> 1. It is hereby declared that the within written Policy which lapsed by non-payment of the premium Due<TextField attribute="value3" type="text" /> is revived under the Special Revival Scheme at the request of the within-named Life Assured made to the Corporation on<TextField attribute="value4" type="text" /> that the risk under the withinmentioned Policy so revived has been commenced on<TextField attribute="value5" type="text" /> and that the premium has been charged for age<TextField attribute="value6" type="text" /> years and will be payable at the enhanced rate of Rs.<TextField attribute="value7" type="text" /> from<TextField attribute="value8" type="text" /> to<TextField attribute="value9" type="text" /> inclusive for a period<TextField attribute="value10" type="text" /> years instead of<TextField attribute="value11" type="text" /> as within mentioned.*Consequently this policy shall mature on<TextField attribute="value12" type="text" /> instead of<TextField attribute="value13" type="text" /> as withinmentioned. It is further declared that together with the proposal and Declaration for Assurance and the statements contained and referred to therein the statements made by the Assured in the Personal Statement regarding Health completed by the Assured for Revival will form the basis of this assurance. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550" >
<p className="text-align: justify;">2. Condition/s re:<TextField attribute="value14" type="text" /> as appearing on the Policy is/are altered as under: </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> (Here mention the new modified condition/s as made applicable to the policy after Special Revival) </p></td>
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

export {Template5058111979};
