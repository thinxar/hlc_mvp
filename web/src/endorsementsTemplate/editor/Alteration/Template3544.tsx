import { DatePicker, TextField, } from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3544 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" >
        <tr>
          <td>
            <h5 className="text-align:right;">Form No. 3544</h5>
            <h3 className="text-align:center;">LIFE INSURANCE CORPORATION OF INDIA</h3>
            <h5 className="text-align:center;"><u>REDUCTION IN SUM ASSURED WITH REDUCTION IN CASH OPTION</u></h5>
          </td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td align="left">Place: <b><TextField attribute="branchName" type="text" /></b></td>
          <td align="right">Date: <b> <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly /></b></td>
          <td className="width:25px;"></td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td className="text-align:center;">
            <b>Re : Policy No. <TextField attribute="polNumber" type="text" readOnly /></b>
          </td>
          <td className="width:25px;"></td>
        </tr>
        <tr><td><br /></td></tr>
        <tr>
          <td className="width:25px;"></td>
          <td>
            <p className="text-justify"> At the request of the <b><TextField attribute="value4" type="text" /></b> (Proposer/Life Assured), the following alterations are hereby made in the Policy: </p>
          </td>
          <td className="width:25px;"></td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td>
            <p className="text-justify"> Sum Assured reduced to Rs. <b><TextField attribute="value5" type="text" /></b> from <b><TextField attribute="value6" type="text" /></b> (due date of the premium). </p>
          </td>
          <td className="width:25px;"></td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td>
            <p className="text-justify"> Cash Option reduced to Rs. <b><TextField attribute="value7" type="text" /></b> premium from <b><TextField attribute="value8" type="text" /></b> at Rs. <b><TextField attribute="value9" type="text" /></b>. </p>
          </td>
          <td className="width:25px;"></td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td>
            <p className="text-justify"> The sum of Rs. <b><TextField attribute="value10" type="text" /></b> has been paid as surrender value of the portion of the Sum Assured dropped. </p>
          </td>
          <td className="width:25px;"></td>
        </tr>
        <tr><td><br /><br /></td></tr>
        <tr>
          <td className="width:25px;"></td>
          <td className="text-align:right;"> for LIFE INSURANCE CORPORATION OF INDIA </td>
          <td className="width:25px;"></td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td className="text-align:right;">
            <br /> SignatureOfApprover<br /> p.Sr/Branch Manager. </td>
          <td className="width:25px;"></td>
        </tr>
      </table>
    </PalmyraForm>
  );
};

export { Template3544 };
