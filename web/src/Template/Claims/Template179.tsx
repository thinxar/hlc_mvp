import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template179 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>
<table width="600" >
<th>
<br />
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center">
<u> <TextField attribute="value97" type="text" /> DIVISIONAL OFFICE <br /> BRANCH : <TextField attribute="value98" type="text" /> </u>
</h5>
<table width="600">
<tr>
<td width="100"></td>
<td width="250" > Policy No. : <TextField attribute="polNumber" type="text" /> <td width="300" align="left">On the life of : <TextField attribute="value99" type="text" /> </td>
</td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> Consequent upon payment of Maturity claim under above policy on <TextField attribute="value3" type="text" /> of Rs. <TextField attribute="value4" type="text" /> </p></td>
<td width="25"></td>
<br />
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> As per plan condition Free life cover for Rs <TextField attribute="value5" type="text" /> granted for next 5 years which shall be available from <TextField attribute="value6" type="text" /> to <TextField attribute="value7" type="text" /> Hence forth, policy will be free from payment of any premiums. Maturity claim/surrender/ loan/ Accident Benefit cover will not be available during this free term insurance cover. </p></td>
<td width="25"></td>
<br />
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"> DATE:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> <br />
<br />
</td>
</tr>
</table>
<table width="600">
<tr>
<td width="300"></td>
<td width="250" align="right"> {/* <SignatureOfApprover> */} <br /> p. Chief / Sr / Branch Manager </td>
</tr>
</table>
</th>
</table>
           </PalmyraForm>
  );
};

export {Template179};
