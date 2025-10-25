import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3733 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3733</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>AGE PROVED HIGHER, POLICY TO BE DATED BACK, PREMIUM UNALTERED (MULTI-PURPOSE)</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place:<TextField attribute="branchName" type="text" /> </td>
<td align="right"> Date: <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly/> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy Number :<TextField attribute="polNumber" type="text" readOnly /> </center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> <TextField attribute="value4" type="text" />(Place and Date) On production of satisfactory evidence the Life Assured's age at entry proved to be<TextField attribute="value5" type="text" /> years. To give him advantage of lower age at entry the following alterations are hereby made in the Policy. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> Age at entry Admitted <TextField attribute="value6" type="text" /> years. <br /> Date of commencement of Policy <TextField attribute="value7" type="text" /> . <br /> Due Dates of Premiums <TextField attribute="value8" type="text" /> each year. <br /> <TextField attribute="value9" type="text" /> Premiums payable from <TextField attribute="value10" type="text" /> altered to Rs. <TextField attribute="value11" type="text" /> . <br /> Date of Last Payment <TextField attribute="value12" type="text" /> . Date of Maturity <TextField attribute="value13" type="text" /> . <br /> Free Paid-up Non-participating Assurance Rs. <TextField attribute="value14" type="text" /> . </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> Received Rs.<TextField attribute="value15" type="text" /> in respect of difference of the premiums paid with interest thereon and Rs.<TextField attribute="value16" type="text" /> as interest for dating back. </p></td>
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

export {Template3733};
