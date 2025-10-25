import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateVRegistrationofAssignment = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right"></h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Registration of Assignment</u></h4>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="250" align="left"> Place: <TextView attribute="branchName" /> </td>
<td width="300" align="right"> Date: <TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify">
<center>Policy No. <TextView attribute="polNumber" /> </center>
</p>
</td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-justify"> Registered on <TextView attribute="value4" /> <br /> Type of Assignment <TextView attribute="value5" /> <br /> Name of the Assignee (1) <TextView attribute="value6" /> <br /> Name of the Assignee (2) <TextView attribute="value7" /> <br /> Name of the Guardian (in case of minor assignee) <TextView attribute="value8" /> <br /> Address of the Assignee <TextView attribute="value9" /> <br /> Telephone No (1) <TextView attribute="value10" /> &nbsp (2) <TextView attribute="value11" /> <br /> Email id of Assignee <TextView attribute="value12" /> <br /> Bank Loan Account Number <TextView attribute="value13" />
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

export {TemplateVRegistrationofAssignment};
