import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5213 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5213</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Loan</u>
</h4>
<h4 className="text-center"><i>Form of endorsement in lieu of reassignment on full repayment of loan in case of policies resulting into claims while the loan subsists where the claim proceeds are
payable on a specified future date or by installments.</i></h4>
<table width="600">
<tr>
<td width="25"></td>
<td width="275" align="left"> Place : <TextField attribute="BranchName" type="text" /> </td>
<td width="275" align="right"> Date :  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br /><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> The Corporation doth hereby agree and declare that it does not claim any right, title or interest in the Policy which is hereby released from the assignment dated <TextField attribute="value3" type="text" /> executed in favour of the Corporation as if it had not been made and the Policy is free from such assignment. The claim under the Policy will be settled only on proper evidence of title being produced. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="100"></td>
<td width="450" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
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

export {Template5213};
