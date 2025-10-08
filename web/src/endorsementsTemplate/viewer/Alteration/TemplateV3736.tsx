import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3736 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.3736</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>WHERE AGE OF ONE OF THE L.A. IS ALTERED, PREMIUM UNALTERED (JOINT LIFE POLICY)</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextView attribute="BranchName" type="text" /> </td>
<td align="right"> Date: %%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy Number :" type="text" />polNumber<TextView attribute="</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> Satisfactory evidence with respect to the ages of the within-named Lives Assured having been produced, their ages have been admitted as" type="text" />value4<TextView attribute="years and" type="text" />value5<TextView attribute="years nearer birthday at entry respectively, the age of Mr./Mrs." type="text" />value6<TextView attribute="having been found to be" type="text" />value7<TextView attribute="years instead of" type="text" />value8%% years as stated in his/her Proposal of Assurance. </p></td>
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

export {TemplateV3736};
