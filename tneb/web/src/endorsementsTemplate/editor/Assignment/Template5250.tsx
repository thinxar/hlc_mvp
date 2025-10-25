import { TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5250 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 5250</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Assignment</u></h4>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">I/We <TextField attribute="value1" type="text" /> and <TextField attribute="value2" type="text" /> the beneficiary/ies named in the within Policy No. <TextField attribute="polNumber" type="text" readOnly /> issued by the Life Insurance Corporation of India on the life of <TextField attribute="value4" type="text" />. Under the provisions of Section 6 of the Married Women's Property Act 1874, in consideration of natural love and affection do as beneficial owner/s hereby assign absolutely my/our beneficial interest in the said policy to my/our beneficial interest in the said policy to my/our beneficial interest in the said policy to my/our (relationship) <TextField attribute="value18" type="text" />(Shri/Smt.)<TextField attribute="value5" type="text" /> aged <TextField attribute="value6" type="text" /> years his/her heirs, executors and administrators.</p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">Dated <TextField attribute="value7" type="text" /> this <TextField attribute="value8" type="text" /> day of <TextField attribute="value9" type="text" /> year .</p>
</td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td>Witness:</td>
</tr>
</table>
<table>
<tr>
<td width="25"></td>
<td width="50" align="right">(1)</td>
<td width="250">Signature</td>
<td width="250"><p className="justify"><TextField attribute="value10" type="text" /></p></td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td></td>
<td>Full Name</td>
<td><p className="justify"><TextField attribute="value11" type="text" /></p></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>Designation</td>
<td><p className="justify"><TextField attribute="value12" type="text" /></p></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>Address</td>
<td><p className="justify"><TextField attribute="value13" type="text" /></p></td>
<td></td>
</tr>
</table>
<br /><br />
<table>
<tr>
<td width="25"></td>
<td width="550" align="right">Signature/s of the </td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td align="right">{/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager.
</td>
<td></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="50" align="right">(2)</td>
<td width="250">Signature</td>
<td width="250"><p className="justify"><TextField attribute="value14" type="text" /></p></td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td></td>
<td>Full Name</td>
<td><p className="justify"><TextField attribute="value15" type="text" /></p></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>Designation</td>
<td><p className="justify"><TextField attribute="value16" type="text" /></p></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>Address</td>
<td><p className="justify"><TextField attribute="value17" type="text" /></p></td>
<td></td>
</tr>
</table>
<br />
<br />
</th>
</table>
           </PalmyraForm>
  );
};

export {Template5250};
