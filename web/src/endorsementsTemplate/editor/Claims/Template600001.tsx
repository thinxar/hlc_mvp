import { TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template600001 = (props: any) => {
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
<td width="550" ><p className="justify"> Paid Rs <TextField attribute="value1" type="text" /> being the <TextField attribute="value7" type="text" /> (1st/2nd) Installment of the claim amount payable on the within mentioned life assured&#39;s surviving <TextField attribute="value2" type="text" /> years as per the Policy Provisions. <br /><br />Paid vide Cheque no. <TextField attribute="value3" type="text" /> for Rs. <TextField attribute="value4" type="text" /> . Dated <TextField attribute="value5" type="text" /> . </p></td>
</tr></table><br /><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="150" >Name of the Bank </td>
<td width="300" align="left"><TextField attribute="value6" type="text" /></td>
</tr>
<tr>
<td width="25"></td>
<td width="150" >Branch </td>
<td width="300" align="left"><TextField attribute="branchName" type="text" /></td>
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

export {Template600001};
