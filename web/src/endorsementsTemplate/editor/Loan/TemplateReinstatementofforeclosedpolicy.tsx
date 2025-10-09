import { DatePicker,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateReinstatementofforeclosedpolicy = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center">
<u>Re-instatement of Foreclosed policy</u>
</h4>
<table width="550" border={0}>
<tr>
<td width="50"></td>
<td width="550" align="center"> &#147;Loan Reinstated&#148; on  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly/> .
</td></tr></table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
<td width="25"></td>
</tr>
</table><br />
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateReinstatementofforeclosedpolicy};
