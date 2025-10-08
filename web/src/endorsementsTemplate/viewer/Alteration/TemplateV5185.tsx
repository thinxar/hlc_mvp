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
<td width="550" align="right"> Date: %%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy No." type="text" />polNumber<TextView attribute="</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="center"><p className="text-align: justify;"> At the request of <u>Life Assured</u> (Proposer) the within policy has been issued in cancellation of his Previous policy bearing number" type="text" />value3<TextView attribute="which was issued to him under Table" type="text" />value4<TextView attribute="for a term of" type="text" />value5<TextView attribute="years and under which" type="text" />value6<TextView attribute="(mode) instalment premiums at the rate of Rs." type="text" />value7<TextView attribute="each have been received from" type="text" />value8<TextView attribute="(due date) to" type="text" />value9<TextView attribute="(due date) both inclusive. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> It is hereby declared and agreed that" type="text" />value10<TextView attribute="(mode) instalment premium payable under this policy is Rs." type="text" />value11<TextView attribute="on and from" type="text" />value12<TextView attribute="(due date). </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> It is further declared and agreed that the reversionary bonus of Rs." type="text" />value13%% vested under the aforesaid previous policy, which has now been cancelled, will now become payable in the manner indicated in the conditions and privileges governing the within policy. </p></td>
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
