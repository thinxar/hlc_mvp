import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5216 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 5216</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>FORM OF ENDORSEMENT FOR REINSTATEMENT OF SURRENDERED POLIC</u>Y</h5>
<br /><table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextView attribute="BranchName" type="text" /> </td>
<td align="right"> Date: %%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">The within policy which was surrendered on (Date of Surrender)" type="text" />value3<TextView attribute="at the request of the within Life Assured and/or Assignee (Name of the Assignee)" type="text" />value4<TextView attribute="is hereby reinstated on (Date of reinstatement)" type="text" />value5<TextView attribute="and all the remarks in regard to cancellation" type="text" />value6<TextView attribute="(and/or) surrender of the Policy placed on the within Policy document are hereby revoked. All the terms and conditions of the Policy and the assignment or nomination, if any, existing and in force immediately prior to the surrender of the Policy on (Date of Surrender)" type="text" />value7%% are also hereby reinstated and shall be valid as if the Policy had not been surrendered.</p></td>
<td width="25"></td>
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

export {TemplateV5216};
