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
<td align="left"> Place: <TextView attribute="branchName" /> </td>
<td align="right"> Date: <TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center>
<b>Re : Policy No. <TextView attribute="polNumber" /></b>
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">At the request of the Life Assured, the Policy has been split up into <TextView attribute="value4" /> Policies for Rs. <TextView attribute="value5" /> and Rs. <TextView attribute="value6" /> (respectively/each) and in consequence the following alterations are hereby made in the within written Policy.</p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="75"></td>
<td width="500"><p className="justify"><TextView attribute="value7" /> Sum Assured reduced to Rs. <TextView attribute="value8" /> .</p></td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td><p className="justify"><TextView attribute="value9" /> Premium from <TextView attribute="value10" /> @ Rs. <TextView attribute="value11" /> .</p></td>
<td></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">The fresh Policy/ies for Rs. <TextView attribute="value12" /> has/have been issued under No/s <TextView attribute="value13" /> .</p></td>
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
