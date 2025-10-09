import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3728 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3728</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>AGE PROVED HIGHER, PREMIUM ALTERED</u></h5>
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
<center> Re : Policy Number :<TextView attribute="polNumber" />
</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> Satisfactory evidence having been produced regarding the Life Assured's age the following alterations are hereby made in the Policy. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> Age at entry Admitted <TextView attribute="value4" /> years. <br /> <TextView attribute="value5" /> premium payable from <TextView attribute="value6" /> to <TextView attribute="value7" /> . <br /> Inclusive altered to Rs.<TextView attribute="value8" /> . <br /> Date of maturity <TextView attribute="value9" /> . <br />Premium Paying Period <TextView attribute="value10" /> years. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> Received/Refunded Rs. <TextView attribute="value11" /> in respect of difference/excess of the premiums paid with interest thereon. </p></td>
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

export {TemplateV3728};
