import { TextView } from 'templates/mantineForm';import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5250 = (props: any) => {
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
<td width="550"><p className="justify">I/We <TextView attribute="value1" /> and <TextView attribute="value2" /> the beneficiary/ies named in the within Policy No. <TextView attribute="polNumber" /> issued by the Life Insurance Corporation of India on the life of <TextView attribute="value4" />. Under the provisions of Section 6 of the Married Women's Property Act 1874, in consideration of natural love and affection do as beneficial owner/s hereby assign absolutely my/our beneficial interest in the said policy to my/our beneficial interest in the said policy to my/our beneficial interest in the said policy to my/our (relationship) <TextView attribute="value18" />(Shri/Smt.)<TextView attribute="value5" /> aged <TextView attribute="value6" /> years his/her heirs, executors and administrators.</p></td>
<td width="25"></td>
</tr>
</table>
<br />
<table>
<tr>
<td width="25"></td>
<td width="550"><p className="justify">Dated <TextView attribute="value7" /> this <TextView attribute="value8" /> day of <TextView attribute="value9" /> year .</p>
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
<td width="250"><p className="justify"><TextView attribute="value10" /></p></td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td></td>
<td>Full Name</td>
<td><p className="justify"><TextView attribute="value11" /></p></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>Designation</td>
<td><p className="justify"><TextView attribute="value12" /></p></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>Address</td>
<td><p className="justify"><TextView attribute="value13" /></p></td>
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
<td width="250"><p className="justify"><TextView attribute="value14" /></p></td>
<td width="25"></td>
</tr>
<tr>
<td></td>
<td></td>
<td>Full Name</td>
<td><p className="justify"><TextView attribute="value15" /></p></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>Designation</td>
<td><p className="justify"><TextView attribute="value16" /></p></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>Address</td>
<td><p className="justify"><TextView attribute="value17" /></p></td>
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

export {TemplateV5250};
