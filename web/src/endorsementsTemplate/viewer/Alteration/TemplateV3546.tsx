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
<td align="left"> Place: <TextView attribute="branchName" /> </td>
<td align="right"> Date: <TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center>
<b>Re : Policy No.</b> <TextView attribute="polNumber" /> </center>
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
<td width="500"> Nature of Alteration <TextView attribute="value4" /> . </td>
<td width="25"></td>
</tr>
<tr>
<td ></td>
<td > Date of Commencement <TextView attribute="value5" /> . </td>
<td ></td>
</tr>
<tr>
<td ></td>
<td > Due Date of Premium <TextView attribute="value6" /> . </td>
<td ></td>
<tr>
<td></td>
<td>
<p className="justify"> <TextView attribute="value7" /> Premium from <TextView attribute="value8" /> to <TextView attribute="value9" /> .</p>
</td>
<td></td>
</tr>
<tr>
<td></td>
<td>Inclusive at Rs <TextView attribute="value10" /> . </td>
<td></td>
</tr>
<tr>
<td></td>
<td>Date of Maturity <TextView attribute="value11" /> . </td>
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
<p className="justify"> Received Rs <TextView attribute="value12" /> being the amount required towards balance of the first Premium Paid / to cover risk from <TextView attribute="value13" /> to <TextView attribute="value14" /> inclusive. </p></td>
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
<i>When date of commencement is altered under C.D.A Policy insert "Deferred Date <TextView attribute="value15" />" after "Date Commencement <TextView attribute="value16" />" in the above schedule.</i>
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
