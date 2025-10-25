import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5095 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5095</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center"><u>FORM OF ENDORSEMENT-PUP FREE FROM LOAN AND INTEREST (TO BE USED IN THE CASE OF FULLY PAID POLICY)</u>.</h5>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextView attribute="branchName" /> </td>
<td align="right"> Date: <TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center> Policy Number : <TextView attribute="polNumber" />
</center>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-justify"> At the request of the within named Life Assured the within written Policy which stood fully paid up by payment of the final <TextView attribute="value4" /> Premium due <TextView attribute="value5" /> has been reduced to Rs. <TextView attribute="value6" /> inclusive of all bonuses already declared free from the <TextView attribute="value7" /> deduction of the existing loan and interest amounting to Rs. <TextView attribute="value8" /> . It is further declared that the Policy will not participate in the profits and will become payable as within mentioned. The sum of Rs. <TextView attribute="value9" /> has been paid as Surrender Value of the portion of the sum assured dropped. </p></td>
<td width="25"></td>
</tr>
</table>
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
<td width="25"></td>
<td width="550" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
<td width="25"></td>
</tr>
</table>
<br /><br />
</th>
</table>
           </PalmyraForm>
  );
};

export {TemplateV5095};
