import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5043 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>
<table width="600" >
<th>
<h5 className="text-right">Form No.5043</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>ENDORSEMENT UNDER CDA/CPA POLICIES WITH PREMIUM WAIVER BENEFIT IN THE EVENT OF THE DEATH OF THE PROPOSER BEFORE THE DEFERRED DATE WHILE THE POLICY IS IN FULL FORCE</u></h5>
<br />
<table>
<tr>
<td width="25"></td>
<td width="250" align="left"> Place: <TextField attribute="BranchName" type="text" /> </td>
<td width="500" align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy No. <TextField attribute="polNumber" type="text" /> on life of <TextField attribute="value4" type="text" />
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;">
The Within-named Proposer having died on <TextField attribute="value5" type="text" /> (Date of Death) and satisfactory proof of his death having been duly furnished, it is hereby declared that the payment of premiums due
from <TextField attribute="value6" type="text" /> upto the Deferred Date. Viz <TextField attribute="value7" type="text" /> will cease. The revised premium of Rs <TextField attribute="value8" type="text" /> shall be payable on the specified due dates commencing on and after the Deferred Date
<TextField attribute="value9" type="text" /> till the "Date of Last Payment" specified in the within-mentioned Policy Schedule.
</p>
</td>
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

export {Template5043};
