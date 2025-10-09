import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV60000 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th><br />
<h2 className="text-center">Life Insurance Corporation of India</h2>
<h5 className="text-center"><u>SURVIVAL BENEFIT WHERE AMOUNT IS LESS THAN Rs.60000</u></h5>
<br />
<br />
<table width="550">
<tr>
<td width="25"></td>
<td width="500" ><p className="justify"> Paid Rs <TextView attribute="value1" /> being the <TextView attribute="value2" /> (1st/2nd) Installment of the claim amount payable on the within mentioned life assured&#39;s surviving <TextView attribute="value3" /> years as per the Policy Provisions. </p>
</td>
<td width="25"></td>
</tr>
</table>
<br /><br />
<table width="550">
<tr>
<td width="25"></td>
<td width="500" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
<td width="25"></td>
</tr>
</table>
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateV60000};
