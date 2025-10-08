import { TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template52495248 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5249 <br />(Corresponding to F. No. 5248)</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Alteration</u></h4><br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"><p className="text-align: justify;"> The Withinnamed assured has by a Deed Poll dated <TextField attribute="value1" type="text" /> given additonal powers to the Trustee/s to raise loans on the security of the within policy from L.I.C. of India for the benefit of beneficiary/ies provided he/she/they is/are major and competent to contract. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" ><p className="text-align: justify;"> Dated at <TextField attribute="value2" type="text" /> this <TextField attribute="value3" type="text" /> day of <TextField attribute="value4" type="text" /> Year	. </p></td>
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

export {Template52495248};
