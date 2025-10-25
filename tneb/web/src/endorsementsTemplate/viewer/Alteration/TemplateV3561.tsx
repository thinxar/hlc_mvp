import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3561 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.3561</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Alteration to With-Profit Plan</u></h4>
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"> Place:<TextView attribute="branchName" /> </td>
<td width="25"></td>
<td width="550" align="right"> Date:<TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="center">
<b>Re : Policy No.</b> <TextView attribute="polNumber" /> </td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-justify"> At the request of the Life Assured the Policy is altered to With Profits Plan and in consequence the following alterations are hereby made in the Policy :</p>
</td><td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="50"></td>
<td width="500" align="left"><p className="text-justify"> Altered to With Profits from <TextView attribute="value4" /> .<br /> <TextView attribute="value5" /> Premiums from <TextView attribute="value6" /> @ Rs <TextView attribute="value7" /> .<br /> To participate in profits for the Biennium commencing on <TextView attribute="value8" /> </p></td><td width="50"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="50"></td>
<td width="500" align="left"><p className="text-justify"> Table No <TextView attribute="value9" /> .<br /> Received Rs <TextView attribute="value10" /> being the amount required to give effect	to the alteration. </p></td><td width="50"></td>
</tr>
</table>
<br />
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

export {TemplateV3561};
