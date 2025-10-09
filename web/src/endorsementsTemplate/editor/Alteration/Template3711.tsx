import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3711 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3711</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>AGE ALTERED BUT PREMIUM UNALTERED</u></h5>
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
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="right">
<p className="text-justify"> Satisfactory evidence having been produced, the age of the within named Life Assured is hereby admitted as <TextField attribute="value4" type="text" /> years nearer birthday at entry,and not <TextField attribute="value5" type="text" /> years as stated in the Proposal for Assurance. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
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

export {Template3711};
