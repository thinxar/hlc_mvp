import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5042192090 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.5042</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>ENDORSEMENT TO BE USED UNDER PLAN 19,20 & 90 WHEN FULL SUM ASSURED IS PAYABLE(POLICY IS IN FULL FORCE)</u></h5>
<br />
<br />
<table width="600" >
<tr>
<td width="25"></td>
<td align="left" width="250"> Place: <TextView attribute="branchName" /> </td>
<td width="300" align="right"> Date: <TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="100"></td>
<td width="250"><p className="text-justify">
<b>Re: Policy No.</b> <TextView attribute="polNumber" /><td width="300" align="left">on Life of <TextView attribute="value4" /> </td></p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> The Within-named Life Assured having died on <TextView attribute="value5" /> and proof of his death having been duly furnished, it is hereby declared that the within-written policy is now free from payment of future premiums. </p></td>
<td width="25"></td>
<br />
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"> *Rs. <TextView attribute="value6" /> will be deducted from the claim amount. <br />
<br />
</td>
</tr>
</table>
<table width="600">
<tr>
<td width="100"></td>
<td width="475" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="300"></td>
<td width="250" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
</tr>
</table>
<br /><br />
*	Applicable to Plan 90 Policies only
<br />
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateV5042192090};
