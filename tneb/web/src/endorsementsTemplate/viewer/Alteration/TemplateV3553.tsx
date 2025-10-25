import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3553 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3553</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Alteration in DOC (where age at entry is altered)</u></h4><br />
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
<b>Re : Policy No.</b> <TextView attribute="polNumber" />
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">At the request of the Life Assured / Proposer the date of commencement of the Policy is altered and in consequence the following alterations are hereby made in the policy.</p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="50"></td>
<td width="525">
<p className="justify">Date of Commencement <TextView attribute="value4" /> Age at entry <TextView attribute="value5" /> years.</p>
</td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td>Due date of Premium <TextView attribute="value6" />.</td>
<td></td>
</tr>
<tr>
<td></td>
<td><p className="justify">Premium from <TextView attribute="value7" /> to <TextView attribute="value8" /> inclusive at Rs. <TextView attribute="value9" />.</p></td>
<td></td>
</tr>
<tr>
<td></td>
<td>Date of Maturity <TextView attribute="value10" />.</td>
<td></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">The sum of Rs. <TextView attribute="value11" /> has been refunded / received in respect of the excess / difference of the premiums paid.</p></td>
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
<hr color="blue" />
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

<i>Under C.D.A Policy insert after "Date of Maturity <TextView attribute="value12" />" </i>

</td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td><i>"Cash Option Rs. <TextView attribute="value13" /> Deferred Date <TextView attribute="value14" />"</i></td>
<td></td>
</tr>
</table>
<br />
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateV3553};
