import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5043 = (props: any) => {
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
<td width="275" align="left"> Place:<TextView attribute="BranchName" type="text" /> </td>
<td width="25"></td>
<td width="275" align="right"> Date:%%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<center>
Re. Policy No." type="text" />polNumber<TextView attribute="on the Life of" type="text" />value4<TextView attribute="</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="justify"> The Within-named Proposer having died on" type="text" />value5<TextView attribute="(Date of Death) and satisfactory proof of his death having been duly furnished, it is hereby declared that the payment of premiums due from" type="text" />value6<TextView attribute="upto the Deferred Date, Viz.," type="text" />value7<TextView attribute="will cease.</p> The revised premium of Rs." type="text" />value8<TextView attribute="shall be payable on the specified due dates commencing on and after the Deferred Date." type="text" />value9%% till the "Date of Last Payment" specified in the within-mentioned Policy Schedule. </td>
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

export {TemplateV5043};
