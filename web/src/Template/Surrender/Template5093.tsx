import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5093 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5093</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>FORM OF ENDORSEMENT-PUP FREE FROM LOAN AND INTEREST (TO BE USED IN THE CASE OF &#147;IN FORCE &#148; POLICIES.)</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextField attribute="BranchName" type="text" /> </td>
<td align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Policy Number : <TextField attribute="polNumber" type="text" />
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> It is hereby declared that at the request of the within named Life Assured the sum assured under the within written Policy has been reduced to Rs. <TextField attribute="value4" type="text" /> inclusive of all bonuses already declared free from payment of premiums due as from <TextField attribute="value5" type="text" /> and from the deduction of the existing loan and interest amounting to Rs. <TextField attribute="value6" type="text" /> It is further declared that the Policy will not participate in the profits <TextField attribute="value7" type="text" /> and will become payable as within mentioned. The sum of Rs. <TextField attribute="value8" type="text" /> has been paid as Surrender Value of the portion of the sum assured dropped. </p></td>
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
<td width="25"></td>
<td width="550" align="right"> {/* <SignatureOfApprover> */} <br />
p.Sr/Branch Manager. </td>
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

export {Template5093};
