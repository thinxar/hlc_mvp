import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3733 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3733</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>AGE PROVED HIGHER, POLICY TO BE DATED BACK, PREMIUM UNALTERED (MULTI-PURPOSE)</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place:<TextView attribute="branchName" /> </td>
<td align="right"> Date:<TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy Number :<TextView attribute="polNumber" /> </center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> <TextView attribute="value4" />(Place and Date) On production of satisfactory evidence the Life Assured's age at entry proved to be<TextView attribute="value5" /> years. To give him advantage of lower age at entry the following alterations are hereby made in the Policy. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> Age at entry Admitted <TextView attribute="value6" /> years. <br /> Date of commencement of Policy <TextView attribute="value7" /> . <br /> Due Dates of Premiums <TextView attribute="value8" /> each year. <br /> <TextView attribute="value9" /> Premiums payable from <TextView attribute="value10" /> altered to Rs. <TextView attribute="value11" /> . <br /> Date of Last Payment <TextView attribute="value12" /> . Date of Maturity <TextView attribute="value13" /> . <br /> Free Paid-up Non-participating Assurance Rs. <TextView attribute="value14" /> . </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> Received Rs.<TextView attribute="value15" /> in respect of difference of the premiums paid with interest thereon and Rs.<TextView attribute="value16" /> as interest for dating back. </p></td>
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

export {TemplateV3733};
