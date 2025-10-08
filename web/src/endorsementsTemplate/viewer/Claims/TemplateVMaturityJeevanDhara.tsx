import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateVMaturityJeevanDhara = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th><br />
<h2 className="text-center">Life Insurance Corporation of India</h2>
<h5 className="text-center"><u>ENDORSEMENT TO BE USED UNDER &#147;JEEVAN DHARA &#148; PLAN</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" ><p className="justify"> Notwithstanding anything mentioned in the Schedule to this policy under the heading &#147;Bonus&#148; The Bonus Guaranteed Maturity addition under the policy has been paid in lump sum with the consent of the annuitant policy holder Assignee and hence it will not be added to the Government to Give amount. <br />Amt. Paid Rs. <TextView attribute="value1" type="text" /> .
</p>
</td>
<td width="25"></td>
</tr>
</table>
<br /><br />
<table width="550">
<tr>
<td width="25"></td>
<td width="550" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
<td width="25"></td>
</tr>
</table>
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateVMaturityJeevanDhara};
