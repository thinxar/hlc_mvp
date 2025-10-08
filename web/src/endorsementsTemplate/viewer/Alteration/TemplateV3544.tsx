import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3544 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3544</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>REDUCTION IN SUM ASSURED WITH REDUCTION IN CASH OPTION</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"> Place: <TextView attribute="BranchName" type="text" /> </td>
<td width="25"></td>
<td width="550" align="right"> Date: %%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="center">
<b>Re : Policy No." type="text" />polNumber<TextView attribute="</b>
</td>
</tr>
</table>
<br /><br />
<table>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> At the request of the" type="text" />value4<TextView attribute="(Proposer/Life Assured) the following alterations are here by made in the Policy :</p>
</td>
<td width="25"></td>
</tr>
<tr>
<td width="50"></td>
<td width="525">
</td>
<td width="25"></td>
</tr>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> Sum Assured reduced to Rs" type="text" />value5<TextView attribute="From" type="text" />value6<TextView attribute="(due date of the Premium) .</p>
</td>
<td width="25"></td>
</tr>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> Cash Option reduced to Rs." type="text" />value7<TextView attribute="premium from" type="text" />value8<TextView attribute="at Rs." type="text" />value9<TextView attribute=".</p>
</td>
<td width="25"></td>
</tr>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> The sum of Rs" type="text" />value10%% has been paid as surrender value of the portion of the Sum Assured dropped. </p></td>
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

export {TemplateV3544};
