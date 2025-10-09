import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5184 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>
<table width="600" >
<th>
<h5 className="text-right">Form No. 5184</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h5 className="text-center">
<u>FORM OF ENDORSEMENT TO BE PLACED ON POLICIES UNDER WHICH REVIVAL AMOUNT IS TO BE PAID BY INSTALMENTS</u></h5>
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="left"> Place: <TextField attribute="branchName" type="text" /> </td>
<td width="25"></td>
<td width="550" align="right"> Date :  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly/> </td>
<td width="25"></td>
</tr>
</table>
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify">
<center>Re: Policy No.<TextField attribute="polNumber" type="text" readOnly /></center>
</p></td>
</tr>
</table>
<br />
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550" ><p className="text-justify"> It is hereby declared and agreed that the within Policy which had lapsed from <TextField attribute="value4" type="text" /> in terms of Conditions and Privileges applicable to the Policy, is revived with effect from<TextField attribute="value5" type="text" /> in consideration of Corporation having received a sum of Rs. <TextField attribute="value6" type="text" /> in part payment of the Revival Amount, the balance of the Revival Amount being payable by the Policyholder in <TextField attribute="value12" type="text" /> (Monthly/Quarterly/Half-Yearly/Yearly) installments each of Rs.<TextField attribute="value7" type="text" /> Payable from <TextField attribute="value8" type="text" /> to <TextField attribute="value9" type="text" /> (both inclusive). The installments of the Revival Amount will be included in the installment premium shown in the Premium Notices, Premium Receipts and Lapse Notices in respect of the installment premiums falling due from<TextField attribute="value10" type="text" /> to <TextField attribute="value11" type="text" /> (both inclusive). </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550"><p className="text-justify"> "Notwithstanding anything within mentioned to the contrary, it is further declared and agreed that in the event of discontinuance of premiums, the normal paid-up values, surrender values and cash values of bonuses will be allowed only on immediate payment of outstanding installments of the Revival Amount. However, in the event of any amount becoming payable by the Corporation on maturity of the policy or in the event of the death of the policyholder, provided the policy was kept in force by regular payment of premiums after revival under installment Revival Scheme and the Life Assured dies during the spread over payment of revival amount, the outstanding installments of the revival amount will be treated as a debt against the policy and will be deducted from the policy moneys. </p></td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<br />
<br />
<table width="600">
<tr>
<td width="25"></td>
<td width="550" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
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

export {Template5184};
