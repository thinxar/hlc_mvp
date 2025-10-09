import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3568 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3568</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>(Where option receive life Annuity/Guaranteed Annuity is exercised)</u></h4>
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
<center> Re : Policy No. <TextView attribute="polNumber" />
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> The Life Assured having exercised the option to receive in lieu of the claim amount a life Annuity <TextView attribute="value4" /> annuity payable for <TextView attribute="value5" /> years certain and so long thereafter as he may be alive having desired to receive the Annuity by <TextView attribute="value6" /> instalments, it is hereby declared he claim amount is payable on the terms and conditions as provided in this behalf in the endorsement dated <TextView attribute="value7" /> </p></td>
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

export {TemplateV3568};
