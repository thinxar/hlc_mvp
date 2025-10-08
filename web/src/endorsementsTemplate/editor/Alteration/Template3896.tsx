import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3896 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3896</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Reduction in the deferment period or the term of the assurance after expiry of the deferment period under CDA policies.</u></h4><br />
<table>
<tr>
<td width="25"></td>
<td width="250" align="left"> Place: <TextField attribute="BranchName" type="text" /> </td>
<td width="500" align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;"> At the request of the Life Assured (Proposer) the following alterations are hereby made in the Policy :-
</p>
</td>
<td width="25"></td>
</tr>
</table>
<br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br /><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;"> Plan of Assurance : <TextField attribute="value4" type="text" /> . <br /> Cash option: Rs. <TextField attribute="value5" type="text" /> . Table No <TextField attribute="value6" type="text" /> . Bonus Rs. <TextField attribute="value7" type="text" /> . <br /> <TextField attribute="value8" type="text" /> premiums from <TextField attribute="value9" type="text" /> to <TextField attribute="value10" type="text" /> . inclusive at Rs <TextField attribute="value11" type="text" /> . <br /> Deferred Date: <TextField attribute="value12" type="text" /> . Date of Maturity <TextField attribute="value13" type="text" /> . </p></td>
<td width="25"></td>
</tr>
</table><br /><br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br /><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" ><p className="text-align: justify;"> Received Rs <TextField attribute="value14" type="text" /> being the amount required to give effect to the alteration. </p></td>
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

export {Template3896};
