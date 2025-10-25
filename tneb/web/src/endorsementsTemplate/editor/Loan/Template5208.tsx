import { TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5208 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center">
<u>Loan</u></h4>
<h4 className="text-center">Endorsement to be used when full loan repayment is made by cash or cheque</h4>
<table width="550" border={0}>
<tr>
<td width="50"></td>
<td width="550" align="left"><p className="text-justify"> We, Life Insurance Corporation Of India, do hereby reassign absolutely all the rights, title and interest in the within Policy of Assurance No. <TextField attribute="value1" type="text" /> and the moneys thereby secured and all Benefits attached thereto to <TextField attribute="value2" type="text" /> and <TextField attribute="value3" type="text" /> for value received .<br /><br />
Date this <TextField attribute="value4" type="text" /> day of <TextField attribute="value5" type="text" />
</p></td></tr></table>
<br />
<br />
<br />
<table>
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
<br /><br /><br />
<table width="550">
<tr>
<td width="25"></td>
<td width="150" align="left">Witness: </td>
<td width="400" align="left"><TextField attribute="value6" type="text" /></td>
</tr>
<tr>
<td width="25"></td>
<td width="150" align="left">Full Name: </td>
<td width="400" align="left"><TextField attribute="value7" type="text" /></td>
</tr>
</table>
<tr>
<td width="25"></td>
<td width="150" align="left">Designation: </td>
<td width="400" align="left"><TextField attribute="value8" type="text" /></td>
</tr>
</th>
</table>
<td width="25"></td> 
           </PalmyraForm>
  );
};

export {Template5208};
