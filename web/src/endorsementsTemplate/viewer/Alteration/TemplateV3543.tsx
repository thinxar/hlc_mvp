import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3543 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 3543</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>"Reduction in Sum Assured"</u></h4>
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
<b>Re : Policy No.</b> <TextView attribute="polNumber" />
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> At the request of the Life Assured the following alterations are hereby made in the Policy: </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> Sum Assured reduced to Rs. <TextView attribute="value4" /> from the premium due <TextView attribute="value5" />. <TextView attribute="value6" /> premiums from <TextView attribute="value7" /> @ Rs. <TextView attribute="value8" /> . </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> The sum of Rs. <TextView attribute="value9" /> has been paid as surrender value* inclusive of cash value of bonus in respect of the portion of the Sum Assured dropped. *Bonus already vested till date shall stand reduced proportionately. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"> (*To be deleted where not applicable) </td>
<td width="25"></td>
</tr>
</table>
<br />
<br /><br />
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

export {TemplateV3543};
