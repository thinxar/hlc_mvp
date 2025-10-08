import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3546 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 3546</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>ALTERATION IN MODE OF PAYMENT & DOC (AGE AT ENTRY REMAIN UNALTERED)</u></h5>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextField attribute="BranchName" type="text" /> </td>
<td align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center>
<b>Re : Policy No.</b> <TextField attribute="polNumber" type="text" /> </center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> At the request of the Life Assured / Proposer the following alterations are hereby made in the Policy:-</p>
</td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table>
<tr>
<td width="75"></td>
<td width="500"> Nature of Alteration <TextField attribute="value4" type="text" /> . </td>
<td width="25"></td>
</tr>
<tr>
<td ></td>
<td > Date of Commencement <TextField attribute="value5" type="text" /> . </td>
<td ></td>
</tr>
<tr>
<td ></td>
<td > Due Date of Premium <TextField attribute="value6" type="text" /> . </td>
<td ></td>
<tr>
<td></td>
<td>
<p className="justify"> <TextField attribute="value7" type="text" /> Premium from <TextField attribute="value8" type="text" /> to <TextField attribute="value9" type="text" /> .</p>
</td>
<td></td>
</tr>
<tr>
<td></td>
<td>Inclusive at Rs <TextField attribute="value10" type="text" /> . </td>
<td></td>
</tr>
<tr>
<td></td>
<td>Date of Maturity <TextField attribute="value11" type="text" /> . </td>
<td></td>
</tr>
</tr>
</table>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> Received Rs <TextField attribute="value12" type="text" /> being the amount required towards balance of the first Premium Paid / to cover risk from <TextField attribute="value13" type="text" /> to <TextField attribute="value14" type="text" /> inclusive. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="100"></td>
<td width="500" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="300"></td>
<td width="300" align="center"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
</tr>
</table>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td>
<i>Note for office use:</i>
</td>
</tr>
</table><br />
<table>
<tr>
<td width="50"></td>
<td width="525">
<i>When date of commencement is altered under C.D.A Policy insert "Deferred Date <TextField attribute="value15" type="text" />" after "Date Commencement <TextField attribute="value16" type="text" />" in the above schedule.</i>
</td>
<td width="25"></td>
</tr>
</table>
<br /><br />
</th>
</table>

           </PalmyraForm>
  );
};

export {Template3546};
