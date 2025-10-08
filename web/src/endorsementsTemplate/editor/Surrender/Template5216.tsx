import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5216 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 5216</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>FORM OF ENDORSEMENT FOR REINSTATEMENT OF SURRENDERED POLIC</u>Y</h5>
<br /><table width="600">
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
<td width="550"><p className="justify">The within policy which was surrendered on (Date of Surrender) <TextField attribute="value3" type="text" /> at the request of the within Life Assured and/or Assignee (Name of the Assignee) <TextField attribute="value4" type="text" /> is hereby reinstated on (Date of reinstatement) <TextField attribute="value5" type="text" /> and all the remarks in regard to cancellation <TextField attribute="value6" type="text" /> (and/or) surrender of the Policy placed on the within Policy document are hereby revoked. All the terms and conditions of the Policy and the assignment or nomination, if any, existing and in force immediately prior to the surrender of the Policy on (Date of Surrender) <TextField attribute="value7" type="text" /> are also hereby reinstated and shall be valid as if the Policy had not been surrendered.</p></td>
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
</th>
</table>
           </PalmyraForm>
  );
};

export {Template5216};
