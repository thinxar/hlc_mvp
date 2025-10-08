import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3731 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3731</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>AGE PROVED HIGHER, POLICY TO BE DATED BACK, PREMIUM UNALTERED(TRIPLE BENEFIT)</u></h5>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextView attribute="BranchName" type="text" /> </td>
<td align="right"> Date: %%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Re : Policy Number :" type="text" />polNumber<TextView attribute="</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> On production of satisfactory evidence the Life Assured's age at entry proved to be" type="text" />value4<TextView attribute="years. To give him advantage of lower age at entry the following alterations are hereby made in the Policy. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> Age at entry Admitted" type="text" />value5<TextView attribute="years. <br /> Date of commencement of Policy" type="text" />value6<TextView attribute=". <br /> Due Dates of Premiums" type="text" />value7<TextView attribute="each year. <br />" type="text" />value8<TextView attribute="Premiums payable from" type="text" />value9<TextView attribute="altered to Rs." type="text" />value10<TextView attribute=". <br /> Date of Last Payment" type="text" />value11<TextView attribute=". <br /> Date of Maturity" type="text" />value12<TextView attribute="Premium Payment Period" type="text" />value13<TextView attribute="years. <br /> Increased Paid-up Assurance Rs." type="text" />value14<TextView attribute=". <br /> Increased Cash Payment Rs." type="text" />value15<TextView attribute=". </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<div className="border-top-className: solid; border-top-width: 2; padding-top: 1"></div>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;"> Received/Refunded Rs." type="text" />value16<TextView attribute="in respect of difference/excess of the premiums paid with interest thereon and Rs." type="text" />value17%% as interest for dating back. </p></td>
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

export {TemplateV3731};
