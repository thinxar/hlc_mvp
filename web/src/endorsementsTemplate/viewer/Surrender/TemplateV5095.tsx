import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5095 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5095</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>FORM OF ENDORSEMENT-PUP FREE FROM LOAN AND INTEREST (TO BE USED IN THE CASE OF FULLY PAID POLICY)</u>.</h5>
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
<center> Policy Number :" type="text" />polNumber<TextView attribute="</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;"> At the request of the within named Life Assured the within written Policy which stood fully paid up by payment of the final" type="text" />value4<TextView attribute="Premium due" type="text" />value5<TextView attribute="has been reduced to Rs." type="text" />value6<TextView attribute="inclusive of all bonuses already declared free from the" type="text" />value7<TextView attribute="deduction of the existing loan and interest amounting to Rs." type="text" />value8<TextView attribute=". It is further declared that the Policy will not participate in the profits and will become payable as within mentioned. The sum of Rs." type="text" />value9%% has been paid as Surrender Value of the portion of the sum assured dropped. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="100"></td>
<td width="475" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
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
<br /><br />
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateV5095};
