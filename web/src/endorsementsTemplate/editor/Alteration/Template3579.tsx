import { TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3579 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.3579</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>(Where option for Conversion into Endowment is exercised)</u></h4><br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> <TextField attribute="value1" type="text" /> (Place and Date) The Life Assured having exercised the option of Converting the Policy at the end of five years into an endowment Assurance Policy for a term of <TextField attribute="value2" type="text" /> years <TextField attribute="value3" type="text" /> (with/without) profit it is hereby declared that the following alterations are hereby made in the Policy. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> <TextField attribute="value4" type="text" /> premiums from <TextField attribute="value5" type="text" /> to <TextField attribute="value6" type="text" /> inclusive at Rs. <TextField attribute="value7" type="text" /> Date of maturity <TextField attribute="value8" type="text" /> </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> The policy will participate in profits from the date of conversion, viz., <TextField attribute="value9" type="text" /> at the rate applicable to Endowment Assurance Policies. </p></td>
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

export {Template3579};
