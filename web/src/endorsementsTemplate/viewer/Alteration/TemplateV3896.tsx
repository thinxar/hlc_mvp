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
<td width="250" align="left"> Place: <TextView attribute="BranchName" type="text" /> </td>
<td width="500" align="right"> Date: %%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;"> At the request of the Life Assured (Proposer) the following alterations are hereby made in the Policy :-
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
<td width="550" align="left"><p className="text-align: justify;"> Plan of Assurance :" type="text" />value4<TextView attribute=". <br /> Cash option: Rs." type="text" />value5<TextView attribute=". Table No" type="text" />value6<TextView attribute=". Bonus Rs." type="text" />value7<TextView attribute=". <br />" type="text" />value8<TextView attribute="premiums from" type="text" />value9<TextView attribute="to" type="text" />value10<TextView attribute=". inclusive at Rs" type="text" />value11<TextView attribute=". <br /> Deferred Date:" type="text" />value12<TextView attribute=". Date of Maturity" type="text" />value13<TextView attribute=". </p></td>
<td width="25"></td>
</tr>
</table><br /><br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br /><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" ><p className="text-align: justify;"> Received Rs" type="text" />value14%% being the amount required to give effect to the alteration. </p></td>
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
