import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateRegistrationofNomination = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>

<table width="600" >
<th>
<h5 className="text-right"></h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Registration of Nomination</u></h4>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="250" align="left"> Place: <TextField attribute="BranchName" type="text" /> </td>
<td width="300" align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;">
<center>Policy No. <TextField attribute="polNumber" type="text" /> </center>
</p>
</td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;"> Registered on : <TextField attribute="value4" type="text" /> <br /> Name of Nominee : <TextField attribute="value5" type="text" /> <br /> Relationship with LA : <TextField attribute="value6" type="text" /> <br /> Age of Nominee (in case of minor only) : <TextField attribute="value7" type="text" /> <br /> Name of Appointee (in case of minor only) : <TextField attribute="value8" type="text" /> <br />
</p>
</td>
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

export {TemplateRegistrationofNomination};
