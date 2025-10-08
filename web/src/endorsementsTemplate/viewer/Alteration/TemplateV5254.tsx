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
<td width="500"> The Sr. Branch Manager,<br /> Life Insurance Corporation of India, <br /><TextView attribute="value1" type="text" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" ><p className="text-align: justify;"> Re: Policy No <TextView attribute="polNumber" type="text" /> on the life of <TextView attribute="value3" type="text" /> issued under the M.W.P. Act, 1874. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;"> The above policy was issued under the provisions of the Married Women's Property Act for the benefit of <TextView attribute="value4" type="text" /> who has/have released his/her/their interest in the policy as per the Deed Poll of Release dated <TextView attribute="value5" type="text" /> </p></td>
<td width="25"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;"> We, the life assured and the trustee/s now request you to cancel the enclosed policy and issue a fresh one in its place in favour of the assured under the Married Women's Property Act for the benefit of <TextView attribute="value6" type="text" /> as per the enclosed form requesting for cancellation of existing policy and issue of a fresh one under the M.W.P. Act executed by the Life Assured. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="250" align="left"> Signature of the Life Assured</td>
<td width="300" align="left"> <TextView attribute="value7" type="text" /> . </td></tr>
<tr>
<td width="25"></td>
<td width="250" align="left"> Signature of the Trustee/s</td>
<td width="300" align="left"> <TextView attribute="value8" type="text" /> . </td>
</tr><tr>
<td width="25"></td>
<td width="250" align="left"> Signature of the Trustee/s</td>
<td width="300" align="left"> <TextView attribute="value9" type="text" /> . </td>
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
