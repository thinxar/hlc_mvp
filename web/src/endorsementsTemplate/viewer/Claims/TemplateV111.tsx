import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV111 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<br />
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center">
<u> <TextView attribute="value97" /> DIVISIONAL OFFICE <br /> BRANCH : <TextView attribute="value98" /> </u>
</h5>
<table width="600">
<tr>
<td width="100"></td>
<td width="250" > Policy No. : <TextView attribute="polNumber" /> <td width="300" align="left">On the life of : <TextView attribute="value99" /> </td>
</td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> Consequent upon payment of Maturity claim under above policy on <TextView attribute="value3" /> of Rs. <TextView attribute="value4" /> </p></td>
<td width="25"></td>
<br />
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> As per plan condition Free life cover for Rs <TextView attribute="value5" /> granted for next 10 years which shall be available from <TextView attribute="value6" /> to <TextView attribute="value7" /> Hence forth, policy will be free from payment of any premiums. Maturity claim/surrender/ loan/ Accident Benefit cover will not be available during this free term insurance cover. </p></td>
<td width="25"></td>
<br />
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"> DATE: <TextView attribute="currDate" /> <br />
<br />
</td>
</tr>
</table>
<table width="600">
<tr>
<td width="300"></td>
<td width="250" align="right"> {/* <SignatureOfApprover> */} <br /> p. Chief / Sr / Branch Manager </td>
</tr>
</table>
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateV111};
