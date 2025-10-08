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
<td align="left"> Place: <TextView attribute="BranchName" type="text" /> </td>
<td align="right"> Date: %%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy No." type="text" />polNumber<TextView attribute="</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> The Life Assured having exercised the option to receive in lieu of the claim amount a life Annuity" type="text" />value4<TextView attribute="annuity payable for" type="text" />value5<TextView attribute="years certain and so long thereafter as he may be alive having desired to receive the Annuity by" type="text" />value6<TextView attribute="instalments, it is hereby declared he claim amount is payable on the terms and conditions as provided in this behalf in the endorsement dated" type="text" />value7%% </p></td>
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
