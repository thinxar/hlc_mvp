import { DatePicker,TextField,} from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3555 = (props: any) => {
  return (
           <PalmyraForm ref={props.formRef} formData={props.formData}>

<table width="600" >
<th>
<h5 className="text-right">Form No. 3555</h5>
<h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
<h4 className="text-center"><u>Removal of Extra Premium.</u></h4><br />
<table width="600">
<tr>
<td width="25"></td>
<td align="left"> Place: <TextField attribute="BranchName" type="text" /> </td>
<td align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" /> </td>
<td width="25"></td>
</tr>
</table>
<br />
<center>
<b>Re : Policy No.</b> <TextField attribute="polNumber" type="text" readOnly />
</center>
<br />
<br />
<table>
<tr>
<td width="25"></td>
<td width="550">
<p className="justify">On production of satisfactory evidence to the effect that that within named Life Assured is successfully operated <TextField attribute="value4" type="text" /> (upon for / cured of) <TextField attribute="value5" type="text" /> successfully <TextField attribute="value6" type="text" /> (vaccinated / wearing) a well- fitted denture <TextField attribute="value7" type="text" /> it is hereby declared that the <TextField attribute="value8" type="text" /> premiums on the within written Policy from <TextField attribute="value9" type="text" /> shall be payable at the rate of Rs <TextField attribute="value10" type="text" /> instead of as within mentioned. </p>
</td>
<td width="25"></td>
</tr>
</table>
<br />
<br />
<table width="600">
<tr>
<td width="100"></td>
<td width="500" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
</tr>
</table>
<br />
<table width="600">
<tr>
<td width="300"></td>
<td width="300" align="center"> {/* <SignatureOfApprover> */} <br />
p.Sr/Branch Manager. </td>
</tr>
</table>
<br />
<br />
</th>
</table>

           </PalmyraForm>
  );
};

export {Template3555};
