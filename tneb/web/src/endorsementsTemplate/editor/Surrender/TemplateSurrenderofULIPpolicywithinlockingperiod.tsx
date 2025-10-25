import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateSurrenderofULIPpolicywithinlockingperiod = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>SURRENDERS DURING LOCK-IN PERIOD <br />(ULIP-cases)</u></h5>
<br />
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
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> The within Policy is Surrendered on <TextField attribute="value4" type="text" /> at the request of within Life Assured and /or Assignee <TextField attribute="value5" type="text" /> <br /><br /> The present Surrender Value of the above Policy amounts to Rs <TextField attribute="value6" type="text" /> /- . <br /><br /> Since the Policy has beein issued subject to 3 years Lock-in Period from date of Commencement of the Policy , the above mentioned Surrender Value is payable on <TextField attribute="value7" type="text" /> after deducting the dues if any , from the said amounts. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="100"></td>
<td width="475" align="right"> FOR LIFE INSURANCE CORPORATION OF INDIA </td>
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

export {TemplateSurrenderofULIPpolicywithinlockingperiod};
