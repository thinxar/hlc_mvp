import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3560 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.3560</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Removal of Occupation Extra Premium (other than military, aviation, Gliding or Parachuting).</u></h4>
<br />
<br />
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
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="center">
<b>Re : Policy Number </b>:" type="text" />polNumber<TextView attribute="</td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="50"></td>
<td width="550" align="left"><p className="text-align: justify;"> At the request of the within named Life Assured the endorsement dated" type="text" />value4<TextView attribute="is cancelled and it is hereby agreed and declared that in lieu thereof an extra premium of Rs." type="text" />value5<TextView attribute="per thousand sum assured per annum is payable under the Policy. In consequence the" type="text" />value6<TextView attribute="premiums due as from" type="text" />value7<TextView attribute="shall be payable at the rate of Rs." type="text" />value8%% instead of as within mentioned. </p></td>
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

export {TemplateV3560};
