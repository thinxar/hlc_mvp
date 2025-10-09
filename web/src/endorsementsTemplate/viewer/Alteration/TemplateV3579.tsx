import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3579 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.3579</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>(Where option for Conversion into Endowment is exercised)</u></h4><br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> <TextView attribute="value1" /> (Place and Date) The Life Assured having exercised the option of Converting the Policy at the end of five years into an endowment Assurance Policy for a term of <TextView attribute="value2" /> years <TextView attribute="value3" /> (with/without) profit it is hereby declared that the following alterations are hereby made in the Policy. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> <TextView attribute="value4" /> premiums from <TextView attribute="value5" /> to <TextView attribute="value6" /> inclusive at Rs. <TextView attribute="value7" /> Date of maturity <TextView attribute="value8" /> </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> The policy will participate in profits from the date of conversion, viz., <TextView attribute="value9" /> at the rate applicable to Endowment Assurance Policies. </p></td>
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

export {TemplateV3579};
