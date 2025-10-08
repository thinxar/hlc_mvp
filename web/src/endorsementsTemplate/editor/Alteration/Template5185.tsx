import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5185 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>
<table width="600" >
<th>
<h5 className="text-right">Form No.5185</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Alteration from Endowment Assurance to Multi purpose plan</u></h4><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy No. <TextField attribute="polNumber" type="text" />
</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="center"><p className="text-align: justify;"> At the request of <u>Life Assured</u> (Proposer) the within policy has been issued in cancellation of his Previous policy bearing number <TextField attribute="value3" type="text" /> which was issued to him under Table <TextField attribute="value4" type="text" /> for a term of <TextField attribute="value5" type="text" /> years and under which <TextField attribute="value6" type="text" /> (mode) instalment premiums at the rate of Rs. <TextField attribute="value7" type="text" /> each have been received from <TextField attribute="value8" type="text" /> (due date) to <TextField attribute="value9" type="text" /> (due date) both inclusive. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> It is hereby declared and agreed that <TextField attribute="value10" type="text" /> (mode) instalment premium payable under this policy is Rs. <TextField attribute="value11" type="text" /> on and from <TextField attribute="value12" type="text" /> (due date). </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> It is further declared and agreed that the reversionary bonus of Rs. <TextField attribute="value13" type="text" /> vested under the aforesaid previous policy, which has now been cancelled, will now become payable in the manner indicated in the conditions and privileges governing the within policy. </p></td>
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

export {Template5185};
