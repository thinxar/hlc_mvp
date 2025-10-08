import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV504290 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5042-A</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>FORM OF ENDORSEMENT WHERE FULL SUM ASSURED IS PAYABLE AT MATURITY UNDER PLAN 90 (WHERE THE CLAIM IS CONSIDERED BASED ON RELAXATION RULES)</u></h5>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="350" align="left"> Place: <TextView attribute="BranchName" type="text" /> </td>
<td width="200" align="right"> Date: %%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<center> Ref: Policy No." type="text" />polNumber<TextView attribute="on the Life of" type="text" />value4<TextView attribute="</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" ><p className="text-align: justify;"> The within-named Life Assured having died on" type="text" />value5<TextView attribute="and proof of his death having been duly furnished,it is hereby declared that the within-written policy stands fully paid-up for Rs." type="text" />value6%% payable on the date of Maturity, and is free from payment of future premiums. The policy will not participate in future profits.
</p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<br />
<table width="600">
<tr>
<td width="100"></td>
<td width="475" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="300"></td>
<td width="250" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
</tr>
</table>
<br />
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateV504290};
