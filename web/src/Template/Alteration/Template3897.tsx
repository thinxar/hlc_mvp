import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3897 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 3897</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Alteration in class or term of assurance or reduction in PPT under a policy other than CDA policies.</u></h4><br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextField attribute="BranchName" type="text" /> </td>
<td align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy No. <TextField attribute="polNumber" type="text" />
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td><p className="justify">At the request of Life Assured the following alterations are hereby made in the proposer Policy.</p></td>
</tr>
</table>
<br />
<hr color="blue" />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550">Plan of Assurance <TextField attribute="value4" type="text" />.</td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td><p className="justify"><TextField attribute="value5" type="text" /> premiums from <TextField attribute="value6" type="text" /> to <TextField attribute="value7" type="text" /> inclusive at Rs <TextField attribute="value8" type="text" />.</p></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td>Date of Maturity <TextField attribute="value9" type="text" />.</td>
<td></td>
</tr>
<tr>
<td></td>
<td><p className="justify">Table No. <TextField attribute="value10" type="text" /> Bonus Rs. <TextField attribute="value11" type="text" />.</p></td>
<td></td>
</tr>
</table>
<br />
<hr color="blue" />
<br />
<table>
<tr>
<td width="25"></td>
<td><p className="justify">Received Rs. <TextField attribute="value12" type="text" /> Being the amount required to give effect to the alteration.</p></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="100"></td>
<td width="500" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="300"></td>
<td width="300" align="center"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
</tr>
</table>
<br />
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {Template3897};
