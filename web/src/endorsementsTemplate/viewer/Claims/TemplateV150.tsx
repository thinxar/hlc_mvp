import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV150 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<br />
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center">
<u> <TextView attribute="value97" type="text" /> DIVISIONAL OFFICE <br /> BRANCH : <TextView attribute="value98" type="text" /> </u>
</h5>
<table width="600">
<tr>
<td width="100"></td>
<td width="250" > Policy No. : <TextView attribute="polNumber" type="text" /> <td width="300" align="left">On the life of : <TextView attribute="value99" type="text" /> </td>
</td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> Consequent upon payment of Maturity claim under above policy on <TextView attribute="value3" type="text" /> of Rs. <TextView attribute="value4" type="text" /> </p></td>
<td width="25"></td>
<br />
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> As per plan condition Free life cover for Rs <TextView attribute="value5" type="text" /> granted for next 10 years which shall be available from <TextView attribute="value6" type="text" /> to <TextView attribute="value7" type="text" /> . Hence forth, policy will be free from payment of any premiums. Maturity claim/surrender/ loan/ Accident Benefit cover will not be available during this free term insurance cover. </p></td>
<td width="25"></td>
<br />
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"> DATE: %%CurrDate%% <br />
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

export {TemplateV150};
