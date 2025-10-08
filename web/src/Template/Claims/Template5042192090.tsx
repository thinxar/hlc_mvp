import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5042192090 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>
<table width="600" >
<th>
<h5 className="text-right">Form No.5042</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>ENDORSEMENT TO BE USED UNDER PLAN 19,20 & 90 WHEN FULL SUM ASSURED IS PAYABLE(POLICY IS IN FULL FORCE)</u></h5>
<br />
<br />
<table width="600" >
<tr>
<td width="25"></td>
<td align="left" width="250"> Place: <TextField attribute="BranchName" type="text" /> </td>
<td width="300" align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="100"></td>
<td width="250"><p className="text-align: justify;">
<b>Re: Policy No.</b> <TextField attribute="polNumber" type="text" /><td width="300" align="left">on Life of <TextField attribute="value4" type="text" /> </td></p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> The Within-named Life Assured having died on <TextField attribute="value5" type="text" /> and proof of his death having been duly furnished, it is hereby declared that the within-written policy is now free from payment of future premiums. </p></td>
<td width="25"></td>
<br />
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"> *Rs. <TextField attribute="value6" type="text" /> will be deducted from the claim amount. <br />
<br />
</td>
</tr>
</table>
<table width="600">
<tr>
<td width="100"></td>
<td width="475" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="300"></td>
<td width="250" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
</tr>
</table>
<br /><br />
*	Applicable to Plan 90 Policies only
<br />
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {Template5042192090};
