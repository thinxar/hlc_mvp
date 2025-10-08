import { TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateForeclosureofPolicy = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>
<table width="600" >
<th>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Foreclosure of policy</u>
</h4>
<table width="550" border={0}>
<tr>
<td ></td>
<td  align="center">Name of branch <TextField attribute="value1" type="text" /> code no. <TextField attribute="value2" type="text" /> .</td>
</tr>
</table><br />
<table width="550" border={0}>
<tr>
<td ></td>
<td  align="center">Policy number <TextField attribute="polNumber" type="text" /> surrendered to loan on <TextField attribute="value3" type="text" /> .</td>
</tr>
<tr>
<td ></td>
<td  align="center">Loan of Rs. <TextField attribute="value4" type="text" /> , loan interest of Rs. <TextField attribute="value5" type="text" /> recovered from </td>
</tr>
<tr>
<td ></td>
<td  align="center">surrender value of Rs. <TextField attribute="value6" type="text" /> x-charge of Rs. <TextField attribute="value7" type="text" /> credited/debited. </td>
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

export {TemplateForeclosureofPolicy};
