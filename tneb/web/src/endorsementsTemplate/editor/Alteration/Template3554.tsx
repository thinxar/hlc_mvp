import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3554 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 3554</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Splitting up of a Policy.</u></h4><br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextField attribute="branchName" type="text" /> </td>
<td align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly/> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center>
<b>Re : Policy No. <TextField attribute="polNumber" type="text" readOnly /></b>
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">At the request of the Life Assured, the Policy has been split up into <TextField attribute="value4" type="text" /> Policies for Rs. <TextField attribute="value5" type="text" /> and Rs. <TextField attribute="value6" type="text" /> (respectively/each) and in consequence the following alterations are hereby made in the within written Policy.</p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="75"></td>
<td width="500"><p className="justify"><TextField attribute="value7" type="text" /> Sum Assured reduced to Rs. <TextField attribute="value8" type="text" /> .</p></td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td><p className="justify"><TextField attribute="value9" type="text" /> Premium from <TextField attribute="value10" type="text" /> @ Rs. <TextField attribute="value11" type="text" /> .</p></td>
<td></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">The fresh Policy/ies for Rs. <TextField attribute="value12" type="text" /> has/have been issued under No/s <TextField attribute="value13" type="text" /> .</p></td>
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

export {Template3554};
