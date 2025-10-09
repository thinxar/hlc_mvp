import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3896 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3896</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Reduction in the deferment period or the term of the assurance after expiry of the deferment period under CDA policies.</u></h4><br />
<table>
<tr>
<td width="25"></td>
<td width="250" align="left"> Place: <TextView attribute="branchName" /> </td>
<td width="500" align="right"> Date: <TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-justify"> At the request of the Life Assured (Proposer) the following alterations are hereby made in the Policy :-
</p>
</td>
<td width="25"></td>
</tr>
</table>
<br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br /><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-justify"> Plan of Assurance : <TextView attribute="value4" /> . <br /> Cash option: Rs. <TextView attribute="value5" /> . Table No <TextView attribute="value6" /> . Bonus Rs. <TextView attribute="value7" /> . <br /> <TextView attribute="value8" /> premiums from <TextView attribute="value9" /> to <TextView attribute="value10" /> . inclusive at Rs <TextView attribute="value11" /> . <br /> Deferred Date: <TextView attribute="value12" /> . Date of Maturity <TextView attribute="value13" /> . </p></td>
<td width="25"></td>
</tr>
</table><br /><br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br /><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" ><p className="text-justify"> Received Rs <TextView attribute="value14" /> being the amount required to give effect to the alteration. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
<td width="25"></td>
</tr>
</table>
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

export {TemplateV3896};
