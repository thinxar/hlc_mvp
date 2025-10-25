import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5059 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5059</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>AMOUNT OF PREMIUM AFTER SPECIAL REVIVAL</u></h5>
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> "Notwithstanding anything within mentioned to the contrary, it is hereby declared and agreed that <TextView attribute="value8" /> (Qly. Hly. Yly.) installment premium payable under the policy stands increased from Rs. <TextView attribute="value1" /> to Rs. <TextView attribute="value2" />, with effect from <TextView attribute="value3" /> , which includes an extra premium of Rs. <TextView attribute="value4" /> . </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"> All other terms and conditions remain unchanged. </td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> Dated at <TextView attribute="value5" /> this <TextView attribute="value6" /> day of <TextView attribute="value7" /> year . </p></td>
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

export {TemplateV5059};
