import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV52535252 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5253 <br />(Corresponding to F.No. 5252) </h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Alteration</u></h4><br />
<h4 className="text-center"><u>Form of Endorsement for Deed Poll of Release</u></h4>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;"> The beneficiary/ies <TextView attribute="value1" type="text" /> has/have by a Deed Poll of Release dated <TextView attribute="value2" type="text" /> released, renounced and surrendered all his/her/their right, title, interest, beneficial interest, and claims in respect of the within Policy of Assurance and the Life Assured, Shri <TextView attribute="value3" type="text" /> shall hold the within Policy for his own benefit as though no trust in favour of the Beneficiary/ies had been created. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" ><p className="text-align: justify;"> Dated at <TextView attribute="value4" type="text" /> this <TextView attribute="value5" type="text" /> day of <TextView attribute="value6" type="text" /> . </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table width="600">
<tr><td width="25"></td>
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

export {TemplateV52535252};
