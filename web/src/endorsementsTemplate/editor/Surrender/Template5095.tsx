import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5095 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5095</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>FORM OF ENDORSEMENT-PUP FREE FROM LOAN AND INTEREST (TO BE USED IN THE CASE OF FULLY PAID POLICY)</u>.</h5>
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
<center> Policy Number : <TextField attribute="polNumber" type="text" readOnly />
</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-justify"> At the request of the within named Life Assured the within written Policy which stood fully paid up by payment of the final <TextField attribute="value4" type="text" /> Premium due <TextField attribute="value5" type="text" /> has been reduced to Rs. <TextField attribute="value6" type="text" /> inclusive of all bonuses already declared free from the <TextField attribute="value7" type="text" /> deduction of the existing loan and interest amounting to Rs. <TextField attribute="value8" type="text" /> . It is further declared that the Policy will not participate in the profits and will become payable as within mentioned. The sum of Rs. <TextField attribute="value9" type="text" /> has been paid as Surrender Value of the portion of the sum assured dropped. </p></td>
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
<td width="550" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
<td width="25"></td>
</tr>
</table>
<br /><br />
</th>
</table>
           </PalmyraForm>
  );
};

export {Template5095};
