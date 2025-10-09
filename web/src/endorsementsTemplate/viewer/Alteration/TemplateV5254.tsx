import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5254 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5254 </h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Alteration</u></h4><br />
<h4 className="text-center"><u>Form of a joint letter by the Assured and the Trustee requesting cancellation of the existing policy and issue of a fresh one in lieu thereof.</u></h4>
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br />
<table width="600">
<tr><td width="25"></td>
<td width="500"> The Sr. Branch Manager,<br /> Life Insurance Corporation of India, <br /><TextView attribute="value1" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" ><p className="text-justify"> Re: Policy No <TextView attribute="polNumber" /> on the life of <TextView attribute="value3" /> issued under the M.W.P. Act, 1874. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-justify"> The above policy was issued under the provisions of the Married Women's Property Act for the benefit of <TextView attribute="value4" /> who has/have released his/her/their interest in the policy as per the Deed Poll of Release dated <TextView attribute="value5" /> </p></td>
<td width="25"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-justify"> We, the life assured and the trustee/s now request you to cancel the enclosed policy and issue a fresh one in its place in favour of the assured under the Married Women's Property Act for the benefit of <TextView attribute="value6" /> as per the enclosed form requesting for cancellation of existing policy and issue of a fresh one under the M.W.P. Act executed by the Life Assured. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="250" align="left"> Signature of the Life Assured</td>
<td width="300" align="left"> <TextView attribute="value7" /> . </td></tr>
<tr>
<td width="25"></td>
<td width="250" align="left"> Signature of the Trustee/s</td>
<td width="300" align="left"> <TextView attribute="value8" /> . </td>
</tr><tr>
<td width="25"></td>
<td width="250" align="left"> Signature of the Trustee/s</td>
<td width="300" align="left"> <TextView attribute="value9" /> . </td>
</tr>
</table><br /><br />
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

export {TemplateV5254};
