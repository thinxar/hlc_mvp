import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3555 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 3555</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Removal of Extra Premium.</u></h4><br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextView attribute="BranchName" type="text" /> </td>
<td align="right"> Date: %%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<br />
<center>
<b>Re : Policy No.</b>" type="text" />polNumber<TextView attribute="</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify">On production of satisfactory evidence to the effect that that within named Life Assured is successfully operated" type="text" />value4<TextView attribute="(upon for / cured of)" type="text" />value5<TextView attribute="successfully" type="text" />value6<TextView attribute="(vaccinated / wearing) a well- fitted denture" type="text" />value7<TextView attribute="it is hereby declared that the" type="text" />value8<TextView attribute="premiums on the within written Policy from" type="text" />value9<TextView attribute="shall be payable at the rate of Rs" type="text" />value10%% instead of as within mentioned. </p>
</td>
<td width="25"></td>
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
<td width="300" align="center"> {/* <SignatureOfApprover> */} <br />
p.Sr/Branch Manager. </td>
</tr>
</table>
<br />
<br />
</th>
</table>

           </PalmyraForm>
  );
};

export {TemplateV3555};
