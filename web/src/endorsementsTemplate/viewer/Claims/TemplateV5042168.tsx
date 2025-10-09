import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5042168 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No.5042 C<br />(JEEVAN ANURAG)</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>FORM OF ENDORSEMENT UNDER &#147;JEEVAN ANURAG &#148; POLICY(PLAN NO 168) WHERE THE LIFE ASSURED DIES BEFORE THE END OF THE SELECTED TERM WHILE THE POLICY IS IN FORCE FOR THE FULL SUM ASSURED</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place:<TextView attribute="branchName" /> </td>
<td width="25"></td>
<td align="right"> Date:<TextView attribute="currDate" /> </td>
</tr>
</table>
<br />
<center> Ref: Policy No. <TextView attribute="polNumber" /> on the Life of <TextView attribute="value4" />
</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> The within-named Life Assured having died on<TextView attribute="value5" /> and proof of his death having been duly furnished and the additional amount equal to the sum assured of Rs.<TextView attribute="value6" /> payable as per the Special Provision under the policy having been duly paid on<TextView attribute="value7" /> it is hereby agreed and declared that the within-written policy is now free from payment of future premiums. </p></td>
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
<td width="300"></td>
<td width="250" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
</tr>
</table>
<br />
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateV5042168};
