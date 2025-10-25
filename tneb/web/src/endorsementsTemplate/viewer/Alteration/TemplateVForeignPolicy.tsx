import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateVForeignPolicy = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h4 className="text-right">Endorsement For Foreign Policy</h4>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Foreign Policy</u></h4>
<br />
<table width="600" align="center" border={0}>
<tr>
<td width="50"></td>
<td width="270" align="left" > Policy Number : <TextView attribute="polNumber" /> </td>
<td width="200" align="left" >Name : <TextView attribute="value2" /> </td>
<td width="80"></td>
</tr>
</table><br /><br />
<table width="600" align="center" border={0}>
<tr>
<td width="25"></td>
<td width="550" align="justify">At the request of the Life Assured the following alterations are hereby made in the Policy.</td>
<td width="25"></td>
</tr>
</table><br />
<table width="600" align="center" border={0}>
<tr>
<td width="25"></td>
<p className="text-justify">
<td width="550" align="justify">Currency altered from <TextView attribute="value18" /> to I.Rupees. In consequence Sum Assured of <TextView attribute="value3" /> altered to <TextView attribute="value4" /> The Monthly premium due from <TextView attribute="value5" /> to <TextView attribute="value6" /> shall be payable at Rs. <TextView attribute="value7" />. The policy will hereafter be an Indian Contract subject to the laws of India and the policy moneys are payable in India at the Divisional Office servicing the policy.</td></p>
<p className="text-justify">It is further declared and agreed that the amount shown in Pounds. Sterling in the various clauses appearin below the caption Conditions 8 Previliges within referred to shall stand converted to I.Rupees at the exchange rate of <TextView attribute="value8" /> (Foreign Currency) = Rs. <TextView attribute="value9" />.</p>
<p className="text-justify"> It is further declared and agreed that the amounts benefits allowed under disability clause 18 2 and Accidental Benefit Clause in the policy condition is limited Rs.20,000/- Rs. 5.00.000/- & Rs.5,00,000/- only respectively.</p>
<p className="text-justify"> It is further declared that the period covering the premiums due from <TextView attribute="value10" /> to <TextView attribute="value11" />	shall be entitled to bonuses as declared for Corporation's under policies and the premiums due from <TextView attribute="value12" /> to <TextView attribute="value13" />	shall be entitled to bonuses as declared for policies on Indian Register.</p>
<p className="text-justify"> It is further declared that words "13 months" may read as "5 Years" under the clause "Revival of discontinuing or lapsed policies" + Dated at <TextView attribute="value14" />, this <TextView attribute="value15" /> ( date ) Day of <TextView attribute="value16" /> ( Month Name) <TextView attribute="value17" /> (Year) .</p>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="right"><b> for LIFE INSURANCE CORPORATION OF INDIA</b>
</td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="right"> {/* <SignatureOfApprover> */} <br /><b> p.Sr/Branch Manager.
</b>
</td>
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

export {TemplateVForeignPolicy};
