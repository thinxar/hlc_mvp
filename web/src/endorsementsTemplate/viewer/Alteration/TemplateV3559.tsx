import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3559 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.3559</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Removal of Occupation Extra Premium (Military, aviation, Gliding or Parachuting).</u></h4>
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
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="center">
<b>Re : Policy Number :</b>" type="text" />polNumber<TextView attribute="</td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> At the request of the within named Life Assured the endorsement dated" type="text" />value4<TextView attribute="is cancelled and it is hereby agreed and declared that in consequence of the Life Assured being engaged in" type="text" />value5<TextView attribute="an extra premium of Rs." type="text" />value6<TextView attribute="per thousand sum assured per annum is payable for" type="text" />value7<TextView attribute="years from" type="text" />value8<TextView attribute="and in terms thereof the" type="text" />value9<TextView attribute="premiums from" type="text" />value10<TextView attribute="to" type="text" />value11<TextView attribute="inclusive shall be payable at the rate of Rs" type="text" />value12<TextView attribute="instead of as within mentioned. The" type="text" />value13<TextView attribute="premiums from" type="text" />value14<TextView attribute="shall be payable at the rate of Rs" type="text" />value15%% </p></td>
<td width="25"></td>
</tr>
</table>
<br />
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

export {TemplateV3559};
