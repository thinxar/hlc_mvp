import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV50431 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5043</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>ENDORSEMENT TO BE USED WHEN PREMIUM WAIVER BENEFIT IS ADMITTED</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="275" align="left"> Place:<TextView attribute="branchName" /> </td>
<td width="25"></td>
<td width="275" align="right"> Date:<TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<center>
Re. Policy No.<TextView attribute="polNumber" /> on the Life of <TextView attribute="value4" />
</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="justify"> The Within-named Proposer having died on<TextView attribute="value5" /> (Date of Death) and satisfactory proof of his death having been duly furnished, it is hereby declared that the payment of premiums due from <TextView attribute="value6" /> upto the Deferred Date, Viz.,<TextView attribute="value7" /> will cease.</p> The revised premium of Rs.<TextView attribute="value8" /> shall be payable on the specified due dates commencing on and after the Deferred Date.<TextView attribute="value9" /> till the "Date of Last Payment" specified in the within-mentioned Policy Schedule. </td>
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

export {TemplateV50431};
