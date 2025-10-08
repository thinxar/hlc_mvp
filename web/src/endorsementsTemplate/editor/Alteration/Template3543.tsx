import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3543 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3543</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>"Reduction in Sum Assured"</u></h4>
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextField attribute="BranchName" type="text" /> </td>
<td align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center>
<b>Re : Policy No.</b> <TextField attribute="polNumber" type="text" readOnly />
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> At the request of the Life Assured the following alterations are hereby made in the Policy: </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> Sum Assured reduced to Rs. <TextField attribute="value4" type="text" /> from the premium due <TextField attribute="value5" type="text" />. <TextField attribute="value6" type="text" /> premiums from <TextField attribute="value7" type="text" /> @ Rs. <TextField attribute="value8" type="text" /> . </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> The sum of Rs. <TextField attribute="value9" type="text" /> has been paid as surrender value* inclusive of cash value of bonus in respect of the portion of the Sum Assured dropped. *Bonus already vested till date shall stand reduced proportionately. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"> (*To be deleted where not applicable) </td>
<td width="25"></td>
</tr>
</table>
<br />
<br /><br />
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

export {Template3543};
