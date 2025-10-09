import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3559 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.3559</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Removal of Occupation Extra Premium (Military, aviation, Gliding or Parachuting).</u></h4>
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
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="center">
<b>Re : Policy Number :</b> <TextField attribute="polNumber" type="text" readOnly /> </td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> At the request of the within named Life Assured the endorsement dated<TextField attribute="value4" type="text" /> is cancelled and it is hereby agreed and declared that in consequence of the Life Assured being engaged in<TextField attribute="value5" type="text" /> an extra premium of Rs.<TextField attribute="value6" type="text" /> per thousand sum assured per annum is payable for<TextField attribute="value7" type="text" /> years from<TextField attribute="value8" type="text" /> and in terms thereof the<TextField attribute="value9" type="text" /> premiums from<TextField attribute="value10" type="text" /> to<TextField attribute="value11" type="text" /> inclusive shall be payable at the rate of Rs<TextField attribute="value12" type="text" /> instead of as within mentioned. The<TextField attribute="value13" type="text" /> premiums from<TextField attribute="value14" type="text" /> shall be payable at the rate of Rs<TextField attribute="value15" type="text" /> </p></td>
<td width="25"></td>
</tr>
</table>
<br />
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

export {Template3559};
