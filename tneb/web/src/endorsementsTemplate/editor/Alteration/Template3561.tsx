import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3561 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.3561</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Alteration to With-Profit Plan</u></h4>
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"> Place:<TextField attribute="branchName" type="text" /> </td>
<td width="25"></td>
<td width="550" align="right"> Date: <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly/> </td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="center">
<b>Re : Policy No.</b> <TextField attribute="polNumber" type="text" readOnly /> </td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-justify"> At the request of the Life Assured the Policy is altered to With Profits Plan and in consequence the following alterations are hereby made in the Policy :</p>
</td><td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="50"></td>
<td width="500" align="left"><p className="text-justify"> Altered to With Profits from <TextField attribute="value4" type="text" /> .<br /> <TextField attribute="value5" type="text" /> Premiums from <TextField attribute="value6" type="text" /> @ Rs <TextField attribute="value7" type="text" /> .<br /> To participate in profits for the Biennium commencing on <TextField attribute="value8" type="text" /> </p></td><td width="50"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="50"></td>
<td width="500" align="left"><p className="text-justify"> Table No <TextField attribute="value9" type="text" /> .<br /> Received Rs <TextField attribute="value10" type="text" /> being the amount required to give effect	to the alteration. </p></td><td width="50"></td>
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

export {Template3561};
