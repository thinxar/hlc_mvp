import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3736 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.3736</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>WHERE AGE OF ONE OF THE L.A. IS ALTERED, PREMIUM UNALTERED (JOINT LIFE POLICY)</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextField attribute="branchName" type="text" /> </td>
<td align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly/> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy Number : <TextField attribute="polNumber" type="text" readOnly />
</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> Satisfactory evidence with respect to the ages of the within-named Lives Assured having been produced, their ages have been admitted as <TextField attribute="value4" type="text" /> years and <TextField attribute="value5" type="text" /> years nearer birthday at entry respectively, the age of Mr./Mrs. <TextField attribute="value6" type="text" /> having been found to be <TextField attribute="value7" type="text" /> years instead of <TextField attribute="value8" type="text" /> years as stated in his/her Proposal of Assurance. </p></td>
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

export {Template3736};
