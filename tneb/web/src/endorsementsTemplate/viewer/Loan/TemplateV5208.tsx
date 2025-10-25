import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5208 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center">
<u>Loan</u></h4>
<h4 className="text-center">Endorsement to be used when full loan repayment is made by cash or cheque</h4>
<table width="550" border={0}>
<tr>
<td width="50"></td>
<td width="550" align="left"><p className="text-justify"> We, Life Insurance Corporation Of India, do hereby reassign absolutely all the rights, title and interest in the within Policy of Assurance No. <TextView attribute="value1" /> and the moneys thereby secured and all Benefits attached thereto to <TextView attribute="value2" /> and <TextView attribute="value3" /> for value received .<br /><br />
Date this <TextView attribute="value4" /> day of <TextView attribute="value5" />
</p></td></tr></table>
<br />
<br />
<br />
<table>
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
<br /><br /><br />
<table width="550">
<tr>
<td width="25"></td>
<td width="150" align="left">Witness: </td>
<td width="400" align="left"><TextView attribute="value6" /></td>
</tr>
<tr>
<td width="25"></td>
<td width="150" align="left">Full Name: </td>
<td width="400" align="left"><TextView attribute="value7" /></td>
</tr>
</table>
<tr>
<td width="25"></td>
<td width="150" align="left">Designation: </td>
<td width="400" align="left"><TextView attribute="value8" /></td>
</tr>
</th>
</table>
<td width="25"></td> 
           </PalmyraForm>
  );
};

export {TemplateV5208};
