import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3553 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3553</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Alteration in DOC (where age at entry is altered)</u></h4><br />
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
<b>Re : Policy No.</b> <TextField attribute="polNumber" type="text" />
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">At the request of the Life Assured / Proposer the date of commencement of the Policy is altered and in consequence the following alterations are hereby made in the policy.</p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="50"></td>
<td width="525">
<p className="justify">Date of Commencement <TextField attribute="value4" type="text" /> Age at entry <TextField attribute="value5" type="text" /> years.</p>
</td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td>Due date of Premium <TextField attribute="value6" type="text" />.</td>
<td></td>
</tr>
<tr>
<td></td>
<td><p className="justify">Premium from <TextField attribute="value7" type="text" /> to <TextField attribute="value8" type="text" /> inclusive at Rs. <TextField attribute="value9" type="text" />.</p></td>
<td></td>
</tr>
<tr>
<td></td>
<td>Date of Maturity <TextField attribute="value10" type="text" />.</td>
<td></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">The sum of Rs. <TextField attribute="value11" type="text" /> has been refunded / received in respect of the excess / difference of the premiums paid.</p></td>
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
<hr color="blue" />
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

<i>Under C.D.A Policy insert after "Date of Maturity <TextField attribute="value12" type="text" />" </i>

</td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td><i>"Cash Option Rs. <TextField attribute="value13" type="text" /> Deferred Date <TextField attribute="value14" type="text" />"</i></td>
<td></td>
</tr>
</table>
<br />
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {Template3553};
