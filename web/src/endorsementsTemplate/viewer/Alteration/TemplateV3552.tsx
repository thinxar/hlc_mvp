import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3552 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 3552</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Waiver of monthly charge in consequence of payment of premiums by Banker's Orders, by deduction from salary or out of Superannuation Fund (applicable where mode of payment is otherwise than monthly and altered to monthly).</u></h4><br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextView attribute="BranchName" type="text" /> </td>
<td align="right"> Date: %%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<br />
<center>
<b>Re : Policy No.</b>" type="text" />polNumber<TextView attribute="</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify"> Notwithstanding anything within mentioned to the contrary, it is hereby declared that the mode of payment of premiums under the within written Policy is altered to monthly system and the monthly premiums from" type="text" />value4<TextView attribute="to" type="text" />value5<TextView attribute="inclusive shall be payable at the rate of Rs." type="text" />value6%% only, if they are paid through (i) Banker's Order (ii) Trustees of a Staff Provident or Superannuation Fund or (iii) Collections made by or under the supervision of his employer and remitted to the Corporation.</p>
</td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> If the premiums are remitted by the Employer by deduction from Salary, the due dates of monthly premium will be deemed to be 20th of every month, instead of the due date within mentioned </p>
</td>
<td width="25"></td>
</tr>
</table>
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
<br />
<br />
</th>
</table>

           </PalmyraForm>
  );
};

export {TemplateV3552};
