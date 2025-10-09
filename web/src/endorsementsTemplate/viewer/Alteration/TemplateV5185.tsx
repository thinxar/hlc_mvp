import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5185 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.5185</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Alteration from Endowment Assurance to Multi purpose plan</u></h4><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="right"> Date: <TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy No. <TextView attribute="polNumber" />
</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="center"><p className="text-justify"> At the request of <u>Life Assured</u> (Proposer) the within policy has been issued in cancellation of his Previous policy bearing number <TextView attribute="value3" /> which was issued to him under Table <TextView attribute="value4" /> for a term of <TextView attribute="value5" /> years and under which <TextView attribute="value6" /> (mode) instalment premiums at the rate of Rs. <TextView attribute="value7" /> each have been received from <TextView attribute="value8" /> (due date) to <TextView attribute="value9" /> (due date) both inclusive. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> It is hereby declared and agreed that <TextView attribute="value10" /> (mode) instalment premium payable under this policy is Rs. <TextView attribute="value11" /> on and from <TextView attribute="value12" /> (due date). </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> It is further declared and agreed that the reversionary bonus of Rs. <TextView attribute="value13" /> vested under the aforesaid previous policy, which has now been cancelled, will now become payable in the manner indicated in the conditions and privileges governing the within policy. </p></td>
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

export {TemplateV5185};
