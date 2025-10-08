import { TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateForeignPolicy = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>
<table width="600" >
<th>
<h4 className="text-right">Endorsement For Foreign Policy</h4>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Foreign Policy</u></h4>
<br />
<table width="600" align="center" border={0}>
<tr>
<td width="50"></td>
<td width="270" align="left" > Policy Number : <TextField attribute="polNumber" type="text" /> </td>
<td width="200" align="left" >Name : <TextField attribute="value2" type="text" /> </td>
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
<p className="text-align: justify;">
<td width="550" align="justify">Currency altered from <TextField attribute="value18" type="text" /> to I.Rupees. In consequence Sum Assured of <TextField attribute="value3" type="text" /> altered to <TextField attribute="value4" type="text" /> The Monthly premium due from <TextField attribute="value5" type="text" /> to <TextField attribute="value6" type="text" /> shall be payable at Rs. <TextField attribute="value7" type="text" />. The policy will hereafter be an Indian Contract subject to the laws of India and the policy moneys are payable in India at the Divisional Office servicing the policy.</td></p>
<p className="text-align: justify;">It is further declared and agreed that the amount shown in Pounds. Sterling in the various clauses appearin below the caption Conditions 8 Previliges within referred to shall stand converted to I.Rupees at the exchange rate of <TextField attribute="value8" type="text" /> (Foreign Currency) = Rs. <TextField attribute="value9" type="text" />.</p>
<p className="text-align: justify;"> It is further declared and agreed that the amounts benefits allowed under disability clause 18 2 and Accidental Benefit Clause in the policy condition is limited Rs.20,000/- Rs. 5.00.000/- & Rs.5,00,000/- only respectively.</p>
<p className="text-align: justify;"> It is further declared that the period covering the premiums due from <TextField attribute="value10" type="text" /> to <TextField attribute="value11" type="text" />	shall be entitled to bonuses as declared for Corporation's under policies and the premiums due from <TextField attribute="value12" type="text" /> to <TextField attribute="value13" type="text" />	shall be entitled to bonuses as declared for policies on Indian Register.</p>
<p className="text-align: justify;"> It is further declared that words "13 months" may read as "5 Years" under the clause "Revival of discontinuing or lapsed policies" + Dated at <TextField attribute="value14" type="text" />, this <TextField attribute="value15" type="text" /> ( date ) Day of <TextField attribute="value16" type="text" /> ( Month Name) <TextField attribute="value17" type="text" /> (Year) .</p>
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

export {TemplateForeignPolicy};
