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
<td width="250" align="left"> Place: <TextView attribute="branchName" /> </td>
<td width="300" align="right"> Date: <TextView attribute="currDate" /> </td>
<td width="25"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify">
<center>Policy No. <TextView attribute="polNumber" /> </center>
</p>
</td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-left"> Ref : <TextView attribute="value4" /> <br />
<br /> Enter text as per requirement. : <br /> <TextView attribute="value5" /> <br />
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
