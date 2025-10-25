import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5042901 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5042-B</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>FORM OF ENDORSEMENT WHERE ONLY HALF THE SUM ASSURED IS PAYABLE AT MATURITY UNDER PLAN 90 (WHERE THE CLAIM IS CONSIDERED BASED ON RELAXATION RULES)</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="350" align="left"> Place: <TextField attribute="branchName" type="text" /> </td>
<td width="200" align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly/> </td>
<td width="25"></td>
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
<td width="550" align="left"><p className="text-justify"> The within-named Life Assured having died on<TextField attribute="value5" type="text" /> and proof of his death having been duly furnished,it is hereby declared that the within-written policy stands reduced to Rs.<TextField attribute="value6" type="text" /> payable on the date of Maturity, and is free from payment of future premiums. The policy will not participate in future profits. </p></td>
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

export {Template5042901};
