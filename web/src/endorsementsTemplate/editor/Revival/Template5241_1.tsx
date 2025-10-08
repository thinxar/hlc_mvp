import { TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5241 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef}>
<table width="600" >
<th>
<h3 className="text-right">Annexure-2</h3>
<p className="text-center">Policy No. : <TextField attribute="polNumber" type="text" /> </p>
<h3 className="text-center">Endorsement to Policy Document for Revival <br />(For Non-Linked Products/Riders)</h3>
<table width="600">
<tr>
<td width="250" ><b>	A. Definition : </b></td>
</tr>
<tr>
<td width="200" align="justify" >
<b>1. Revival</b> of a policy means restoration of the policy, which was discontinued due to non-payment of premium, by the insurer with all the benefits mentioned in the policy document, with or without rider benefits if any, upon the receipt of all the premiums due and other charges or late fee, if any, as per the terms and conditions of the policy, upon being satisfied as to the Continued Insurability of the Life Assured and/or Proposer (if LICs Premium Waiver Benefit Rider is opted for).</td>
</tr>
<tr>
<td width="200" align="justify">
<b>2. Revival Period </b>means the period of five consecutive years from the date of first unpaid premium, during which period the policyholder is entitled to revive the policy which was discontinued due to the non-payment of premium.</td>
</tr>
<tr>
<td width="200" align="justify">
<b>3. Continued Insurability </b>is the determination of insurability of Life Assured/Proposer on revival of policy with rider(s) if opted for, to the satisfaction of the Corporation based on the information, documents and reports that are already available and any additional information in this regard if and as may be required in accordance with the Underwriting Policy of the Corporation at the time of revival. </td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="250" ><b>	B. Conditions : </b></td>
</tr>
<tr>
<td width="200" align="justify">
<b>Revival of Lapsed Policies:</b> An Insurance Policy would lapse on non-payment of due premium within the days of grace. A policy in lapsed condition may be revived during the life time of the Life Assured, but within the Revival Period and before the Date of Maturity, as the case may be. The revival shall be effected on payment of all the arrears of premium(s) together with interest (compounding half yearly) at such rate as may be fixed by the Corporation from time to time and on satisfaction of Continued Insurability of the Life Assured and/or Proposer ((if LICs Premium Waiver Benefit Rider is opted for) on the basis of information, documents and reports that are already available and any additional information in this regard if and as may be required in accordance with the Underwriting Policy of the Corporation at the time of revival, being furnished by the Policyholder/Life Assured/Proposer. </td>
</tr>
<tr>
<td width="200" align="justify"> The Corporation, however, reserves the right to accept at original terms, accept with modified terms or decline the revival of a discontinued policy. The revival of the discontinued policy shall take effect only after the same is approved by the Corporation and is specifically communicated to the Life Assured.</td>
</tr>
<tr>
<td width="200" align="justify"> Revival of Rider(s), if opted for, will only be considered along with the revival of the Base policy and not in isolation. </td>
</tr>
</table>
<table width="600">
<tr>
<td width="300"></td>
<td width="250" align="right"> {/* <SignatureOfApprover> */} <br /> p. Chief / Sr / Branch Manager </td>
</tr>
</table>
</th>
</table>
           </PalmyraForm>
  );
};

export {Template5241};
