import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5200 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 5200</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<br />
<h4 className="text-center">Endorsement on Loan Receipts (Form No 5200) where loan amount is fully or partly repaid
</h4><br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextField attribute="BranchName" type="text" /> </td>
<td align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td><p className="justify">(Date of repayment) <TextField attribute="value3" type="text" /> Rs. (amount in figures) <TextField attribute="value4" type="text" /> Amount Rupees (amount in words) <TextField attribute="value5" type="text" />. Loan repaid in part.	</p>
</td>
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
</tr>
</table>
<br />
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {Template5200};
