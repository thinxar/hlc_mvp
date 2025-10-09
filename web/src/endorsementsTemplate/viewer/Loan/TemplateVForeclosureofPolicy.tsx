import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateVForeclosureofPolicy = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Foreclosure of policy</u>
</h4>
<table width="550" border={0}>
<tr>
<td ></td>
<td  align="center">Name of branch <TextView attribute="value1" /> code no. <TextView attribute="value2" /> .</td>
</tr>
</table><br />
<table width="550" border={0}>
<tr>
<td ></td>
<td  align="center">Policy number <TextView attribute="polNumber" /> surrendered to loan on <TextView attribute="value3" /> .</td>
</tr>
<tr>
<td ></td>
<td  align="center">Loan of Rs. <TextView attribute="value4" /> , loan interest of Rs. <TextView attribute="value5" /> recovered from </td>
</tr>
<tr>
<td ></td>
<td  align="center">surrender value of Rs. <TextView attribute="value6" /> x-charge of Rs. <TextView attribute="value7" /> credited/debited. </td>
</tr>
</table>
<br /><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
<td width="25"></td>
</tr>
</table>
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateVForeclosureofPolicy};
