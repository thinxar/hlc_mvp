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
<td width="250" align="left"> Place: <TextView attribute="BranchName" type="text" /> </td>
<td width="300" align="right"> Date: %%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;">
<center>Policy No." type="text" />polNumber<TextView attribute="</center>
</p>
</td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;"> Registered on" type="text" />value4<TextView attribute="<br /> Type of Assignment" type="text" />value5<TextView attribute="<br /> Name of the Assignee (1)" type="text" />value6<TextView attribute="<br /> Name of the Assignee (2)" type="text" />value7<TextView attribute="<br /> Name of the Guardian (in case of minor assignee)" type="text" />value8<TextView attribute="<br /> Address of the Assignee" type="text" />value9<TextView attribute="<br /> Telephone No (1)" type="text" />value10<TextView attribute="&nbsp (2)" type="text" />value11<TextView attribute="<br /> Email id of Assignee" type="text" />value12<TextView attribute="<br /> Bank Loan Account Number" type="text" />value13%%
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
