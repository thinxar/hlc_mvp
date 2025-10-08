import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5058 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5058</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>FORM OF ENDORSEMENT TO BE USED IN RESPECT OF POLICIES WHERE THERE IS NO CHANGE IN RATE OF INTEREST</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="275" align="left"> Place: <TextField attribute="BranchName" type="text" /> </td>
<td width="275" align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> It is hereby declared that the within written Policy which lapsed by non- payment of the premium due <TextField attribute="value3" type="text" /> is revived under the Special Revival Scheme at the request of the within named Life Assured made to the Corporation on <TextField attribute="value4" type="text" /> that the risk under the within mentioned Policy so revived has been commenced on <TextField attribute="value5" type="text" /> and that the premium has been charged for age <TextField attribute="value6" type="text" /> years and will be payable at the enhanced rate of Rs. <TextField attribute="value7" type="text" /> from <TextField attribute="value8" type="text" /> to <TextField attribute="value9" type="text" /> inclusive for a period of <TextField attribute="value10" type="text" /> years instead of <TextField attribute="value11" type="text" /> as within mentioned. *Consequently this Policy shall mature on <TextField attribute="value12" type="text" /> instead of <TextField attribute="value13" type="text" /> as within mentioned. It is further declared that together with the Proposal and Declaration for Assurance and the statements contained and referred to therein in statements made by the Assured in the Personal Statement regarding Health completed by the Assured for Revival will form the basis of this assurance. </p></td>
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
</table><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="40"></td>
<td width="535"> *This sentence is to be added when endorsement is applied to an Endowment </td>
<td width="25"></td>
</tr>
</table>
<table>
<tr>
<td width="25"></td>
<td width="550"> type of Policy. </td>
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

export {Template5058};
