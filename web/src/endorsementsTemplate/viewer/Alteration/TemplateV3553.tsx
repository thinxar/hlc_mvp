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
<td width="550"><p className="justify">At the request of the Life Assured / Proposer the date of commencement of the Policy is altered and in consequence the following alterations are hereby made in the policy.</p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="50"></td>
<td width="525">
<p className="justify">Date of Commencement" type="text" />value4<TextView attribute="Age at entry" type="text" />value5<TextView attribute="years.</p>
</td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td>Due date of Premium" type="text" />value6<TextView attribute=".</td>
<td></td>
</tr>
<tr>
<td></td>
<td><p className="justify">Premium from" type="text" />value7<TextView attribute="to" type="text" />value8<TextView attribute="inclusive at Rs." type="text" />value9<TextView attribute=".</p></td>
<td></td>
</tr>
<tr>
<td></td>
<td>Date of Maturity" type="text" />value10<TextView attribute=".</td>
<td></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">The sum of Rs." type="text" />value11<TextView attribute="has been refunded / received in respect of the excess / difference of the premiums paid.</p></td>
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

<i>Under C.D.A Policy insert after "Date of Maturity" type="text" />value12<TextView attribute="" </i>

</td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td><i>"Cash Option Rs." type="text" />value13<TextView attribute="Deferred Date" type="text" />value14%%"</i></td>
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
