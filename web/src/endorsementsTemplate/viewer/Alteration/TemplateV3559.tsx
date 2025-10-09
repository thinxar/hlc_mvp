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
<td align="left"> Place: <TextView attribute="branchName" /> </td>
<td align="right"> Date: <TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="center">
<b>Re : Policy Number :</b> <TextView attribute="polNumber" /> </td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> At the request of the within named Life Assured the endorsement dated<TextView attribute="value4" /> is cancelled and it is hereby agreed and declared that in consequence of the Life Assured being engaged in<TextView attribute="value5" /> an extra premium of Rs.<TextView attribute="value6" /> per thousand sum assured per annum is payable for<TextView attribute="value7" /> years from<TextView attribute="value8" /> and in terms thereof the<TextView attribute="value9" /> premiums from<TextView attribute="value10" /> to<TextView attribute="value11" /> inclusive shall be payable at the rate of Rs<TextView attribute="value12" /> instead of as within mentioned. The<TextView attribute="value13" /> premiums from<TextView attribute="value14" /> shall be payable at the rate of Rs<TextView attribute="value15" /> </p></td>
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
