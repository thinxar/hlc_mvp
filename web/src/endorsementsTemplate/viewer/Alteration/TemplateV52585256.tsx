import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV52585256 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5258 <br />(Corresponding to Form No. 5256)</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Alteration</u></h4>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="250" align="left"><p className="text-align: justify;"> Place: <TextView attribute="BranchName" type="text" /> <td width="300" align="right">Date: %%CurrDate<TextView attribute="</td>
</p>
</td>
<td width="25"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;">
<br /><br />At the request of the within-named Life Assured, the within Policy is issued under the Married Women's Property Act, 1874, in entire cancellation of the earlier policy issued in his own favour bearing the same number and dated" type="text" />value3%% which earlier policy in original has been delivered to the Life Insurance Corporation of India for cancellation,the within policy being entitled to the same privileges to which the said original policy was entitled. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
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

export {TemplateV52585256};
