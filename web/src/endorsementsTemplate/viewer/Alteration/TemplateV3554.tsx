import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3554 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 3554</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Splitting up of a Policy.</u></h4><br />
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
<b>Re : Policy No." type="text" />polNumber<TextView attribute="</b>
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">At the request of the Life Assured, the Policy has been split up into" type="text" />value4<TextView attribute="Policies for Rs." type="text" />value5<TextView attribute="and Rs." type="text" />value6<TextView attribute="(respectively/each) and in consequence the following alterations are hereby made in the within written Policy.</p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="75"></td>
<td width="500"><p className="justify">" type="text" />value7<TextView attribute="Sum Assured reduced to Rs." type="text" />value8<TextView attribute=".</p></td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td><p className="justify">" type="text" />value9<TextView attribute="Premium from" type="text" />value10<TextView attribute="@ Rs." type="text" />value11<TextView attribute=".</p></td>
<td></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">The fresh Policy/ies for Rs." type="text" />value12<TextView attribute="has/have been issued under No/s" type="text" />value13%% .</p></td>
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

export {TemplateV3554};
