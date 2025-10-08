import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateVOtherEndorsement = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right"></h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Other Endorsement</u></h4>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="250" align="left"> Place: <TextView attribute="BranchName" type="text" /> </td>
<td width="300" align="right"> Date: %%CurrDate<TextView attribute="</td>
<td width="25"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-align: justify;">
<center>Policy No." type="text" />polNumber<TextView attribute="</center>
</p>
</td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: left;"> Ref :" type="text" />value4<TextView attribute="<br />
<br /> Enter text as per requirement. : <br />" type="text" />value5%% <br />
</p>
</td>
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

export {TemplateVOtherEndorsement};
