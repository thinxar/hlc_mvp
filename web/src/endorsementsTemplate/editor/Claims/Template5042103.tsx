import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5042103 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.5042<br />(JEEVAN CHAYA)</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>FORM OF ENDORSEMENT UNDER &#147;JEEVAN CHHAYA &#148; POLICY(PLAN NO 103) WHERE THE LIFE ASSURED DIES BEFORE THE END OF THE SELECTED TERM TERM WHILE THE POLICY IS IN FORCE FOR THE FULL SUM ASSURED</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place:<TextField attribute="BranchName" type="text" /> </td>
<td width="25"></td>
<td align="right"> Date: <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
</tr>
</table>
<br />
<center> Ref: Policy No. <TextField attribute="polNumber" type="text" readOnly /> on the Life of <TextField attribute="value4" type="text" />
</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> The within-named Life Assured having died on<TextField attribute="value5" type="text" /> and proof of his death having been duly furnished and the additional amount equal to the sum assured of Rs.<TextField attribute="value6" type="text" /> payable as per the Special Provision under the policy having been duly paid on<TextField attribute="value7" type="text" /> it is hereby agreed and declared that the within-written policy is now free from payment of future premiums. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
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
<br />
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {Template5042103};
