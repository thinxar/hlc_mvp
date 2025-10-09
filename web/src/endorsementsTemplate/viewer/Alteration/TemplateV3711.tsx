import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3711 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3711</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>AGE ALTERED BUT PREMIUM UNALTERED</u></h5>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextView attribute="branchName" /> </td>
<td align="right"> Date: <TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy Number : <TextView attribute="polNumber" />
</center>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="right">
<p className="text-justify"> Satisfactory evidence having been produced, the age of the within named Life Assured is hereby admitted as <TextView attribute="value4" /> years nearer birthday at entry,and not <TextView attribute="value5" /> years as stated in the Proposal for Assurance. </p></td>
<td width="25"></td>
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

export {TemplateV3711};
