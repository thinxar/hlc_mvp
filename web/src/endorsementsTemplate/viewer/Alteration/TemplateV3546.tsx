import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3546 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 3546</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>ALTERATION IN MODE OF PAYMENT & DOC (AGE AT ENTRY REMAIN UNALTERED)</u></h5>
<br />
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
<td width="550">
<p className="justify"> At the request of the Life Assured / Proposer the following alterations are hereby made in the Policy:-</p>
</td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table>
<tr>
<td width="75"></td>
<td width="500"> Nature of Alteration" type="text" />value4<TextView attribute=". </td>
<td width="25"></td>
</tr>
<tr>
<td ></td>
<td > Date of Commencement" type="text" />value5<TextView attribute=". </td>
<td ></td>
</tr>
<tr>
<td ></td>
<td > Due Date of Premium" type="text" />value6<TextView attribute=". </td>
<td ></td>
<tr>
<td></td>
<td>
<p className="justify">" type="text" />value7<TextView attribute="Premium from" type="text" />value8<TextView attribute="to" type="text" />value9<TextView attribute=".</p>
</td>
<td></td>
</tr>
<tr>
<td></td>
<td>Inclusive at Rs" type="text" />value10<TextView attribute=". </td>
<td></td>
</tr>
<tr>
<td></td>
<td>Date of Maturity" type="text" />value11<TextView attribute=". </td>
<td></td>
</tr>
</tr>
</table>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> Received Rs" type="text" />value12<TextView attribute="being the amount required towards balance of the first Premium Paid / to cover risk from" type="text" />value13<TextView attribute="to" type="text" />value14<TextView attribute="inclusive. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="100"></td>
<td width="500" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="300"></td>
<td width="300" align="center"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
</tr>
</table>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td>
<i>Note for office use:</i>
</td>
</tr>
</table><br />
<table>
<tr>
<td width="50"></td>
<td width="525">
<i>When date of commencement is altered under C.D.A Policy insert "Deferred Date" type="text" />value15<TextView attribute="" after "Date Commencement" type="text" />value16%%" in the above schedule.</i>
</td>
<td width="25"></td>
</tr>
</table>
<br /><br />
</th>
</table>

           </PalmyraForm>
  );
};

export {TemplateV3546};
