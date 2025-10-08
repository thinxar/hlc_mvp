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
<td width="550" align="left"> Place:<TextView attribute="BranchName" type="text" /> </td>
<td width="25"></td>
<td width="550" align="right"> Date:%%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="center">
<b>Re : Policy No.</b>" type="text" />polNumber<TextView attribute="</td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;"> At the request of the Life Assured the Policy is altered to With Profits Plan and in consequence the following alterations are hereby made in the Policy :</p>
</td><td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="50"></td>
<td width="500" align="left"><p className="text-align: justify;"> Altered to With Profits from" type="text" />value4<TextView attribute=".<br />" type="text" />value5<TextView attribute="Premiums from" type="text" />value6<TextView attribute="@ Rs" type="text" />value7<TextView attribute=".<br /> To participate in profits for the Biennium commencing on" type="text" />value8<TextView attribute="</p></td><td width="50"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="50"></td>
<td width="500" align="left"><p className="text-align: justify;"> Table No" type="text" />value9<TextView attribute=".<br /> Received Rs" type="text" />value10%% being the amount required to give effect	to the alteration. </p></td><td width="50"></td>
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
