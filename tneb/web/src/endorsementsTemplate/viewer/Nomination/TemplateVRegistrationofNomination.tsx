import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateVRegistrationofNomination = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right"></h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Registration of Nomination</u></h4>
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
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-justify"> Registered on : <TextView attribute="value4" /> <br /> Name of Nominee : <TextView attribute="value5" /> <br /> Relationship with LA : <TextView attribute="value6" /> <br /> Age of Nominee (in case of minor only) : <TextView attribute="value7" /> <br /> Name of Appointee (in case of minor only) : <TextView attribute="value8" /> <br />
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

export {TemplateVRegistrationofNomination};
