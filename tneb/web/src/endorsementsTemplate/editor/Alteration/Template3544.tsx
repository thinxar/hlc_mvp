import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3544 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3544</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>REDUCTION IN SUM ASSURED WITH REDUCTION IN CASH OPTION</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"> Place: <TextField attribute="branchName" type="text" /> </td>
<td width="25"></td>
<td width="550" align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly/> </td>
<td width="25"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="center">
<b>Re : Policy No. <TextField attribute="polNumber" type="text" readOnly /></b>
</td>
</tr>
</table>
<br /><br />
<table>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> At the request of the <TextField attribute="value4" type="text" /> (Proposer/Life Assured) the following alterations are here by made in the Policy :</p>
</td>
<td width="25"></td>
</tr>
<tr>
<td width="50"></td>
<td width="525">
</td>
<td width="25"></td>
</tr>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> Sum Assured reduced to Rs <TextField attribute="value5" type="text" /> From <TextField attribute="value6" type="text" /> (due date of the Premium) .</p>
</td>
<td width="25"></td>
</tr>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> Cash Option reduced to Rs. <TextField attribute="value7" type="text" /> premium from <TextField attribute="value8" type="text" /> at Rs. <TextField attribute="value9" type="text" /> .</p>
</td>
<td width="25"></td>
</tr>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> The sum of Rs <TextField attribute="value10" type="text" /> has been paid as surrender value of the portion of the Sum Assured dropped. </p></td>
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

export {Template3544};
