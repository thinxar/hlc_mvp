import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateVMaturityJeevanSuraksha = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th><br />
<h2 className="text-center">Life Insurance Corporation of India</h2>
<h5 className="text-center"><u>ENDORSEMENT TO BE USED UNDER &#147;JEEVAN SURAKSHA &#148; PLAN</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550">
<p className="justify"> N.C.O. Rs. <TextView attribute="value1" /> . 25% of NCO opted <TextView attribute="value2" /> (Yes/No)YES/NO option for annuity 25% of NCO Rs. <TextView attribute="value3" /> on Annuity Amt <TextView attribute="value4" /> W.E.F <TextView attribute="value5" /> .
</p>

</td>
<td width="25"></td>
</tr>
</table>
<br />
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

export {TemplateVMaturityJeevanSuraksha};
