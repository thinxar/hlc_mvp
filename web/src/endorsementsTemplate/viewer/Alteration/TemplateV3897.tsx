import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3897 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 3897</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Alteration in class or term of assurance or reduction in PPT under a policy other than CDA policies.</u></h4><br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextView attribute="branchName" /> </td>
<td align="right"> Date: <TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy No. <TextView attribute="polNumber" />
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td><p className="justify">At the request of Life Assured the following alterations are hereby made in the proposer Policy.</p></td>
</tr>
</table>
<br />
<hr color="blue" />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550">Plan of Assurance <TextView attribute="value4" />.</td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td><p className="justify"><TextView attribute="value5" /> premiums from <TextView attribute="value6" /> to <TextView attribute="value7" /> inclusive at Rs <TextView attribute="value8" />.</p></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td>Date of Maturity <TextView attribute="value9" />.</td>
<td></td>
</tr>
<tr>
<td></td>
<td><p className="justify">Table No. <TextView attribute="value10" /> Bonus Rs. <TextView attribute="value11" />.</p></td>
<td></td>
</tr>
</table>
<br />
<hr color="blue" />
<br />
<table>
<tr>
<td width="25"></td>
<td><p className="justify">Received Rs. <TextView attribute="value12" /> Being the amount required to give effect to the alteration.</p></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="100"></td>
<td width="500" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="300"></td>
<td width="300" align="center"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
</tr>
</table>
<br />
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateV3897};
