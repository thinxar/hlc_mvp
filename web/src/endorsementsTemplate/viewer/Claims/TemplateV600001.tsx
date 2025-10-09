import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV600001 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th><br />
<h2 className="text-center">Life Insurance Corporation of India</h2>
<h5 className="text-center"><u>SURVIVAL BENEFIT WHERE AMOUNT IS MORE THAN Rs.60000</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" ><p className="justify"> Paid Rs <TextView attribute="value1" /> being the <TextView attribute="value7" /> (1st/2nd) Installment of the claim amount payable on the within mentioned life assured&#39;s surviving <TextView attribute="value2" /> years as per the Policy Provisions. <br /><br />Paid vide Cheque no. <TextView attribute="value3" /> for Rs. <TextView attribute="value4" /> . Dated <TextView attribute="value5" /> . </p></td>
</tr></table><br /><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="150" >Name of the Bank </td>
<td width="300" align="left"><TextView attribute="value6" /></td>
</tr>
<tr>
<td width="25"></td>
<td width="150" >Branch </td>
<td width="300" align="left"><TextView attribute="branchName" /></td>
</tr>
<td width="25"></td>
</table>
<br /><br /><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
<td width="25"></td>
</tr>
</table>
<br /><br />
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateV600001};
