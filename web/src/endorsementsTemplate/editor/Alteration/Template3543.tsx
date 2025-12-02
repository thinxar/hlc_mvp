import { DatePicker, TextField, } from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3543 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" >
        <tr>
          <td>
            <h5 className="text-align:right;">Form No. 3543</h5>
            <h3 className="text-align:center;">LIFE INSURANCE CORPORATION OF INDIA</h3>
            <h4 className="text-align:center;"><u>Reduction in Sum Assured</u></h4>
          </td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td>Place: <b><TextField attribute="branchName" type="text" /></b></td>
          <td className="text-align:right;">Date: <b> <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly /></b></td>
          <td className="width:25px;"></td>
        </tr>
        <tr>
          <td className="text-align:center;">
            <b>Re : Policy No. <TextField attribute="polNumber" type="text" readOnly /></b>
          </td>
        </tr>
        <tr>
          <td>
            <p className="text-justify"> At the request of the Life Assured the following alterations are hereby made in the Policy: </p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="text-justify"> Sum Assured reduced to Rs. <b><TextField attribute="value4" type="text" /></b> from the premium due <b><TextField attribute="value5" type="text" /></b>. <b><TextField attribute="value6" type="text" /></b> premiums from <b><TextField attribute="value7" type="text" /></b> @ Rs. <b><TextField attribute="value8" type="text" /></b>. </p>
          </td>
        </tr>
        <tr>
          <td >
            <p className="text-justify"> The sum of Rs. <b><TextField attribute="value9" type="text" /></b> has been paid as surrender value* inclusive of cash value of bonus in respect of the portion of the Sum Assured dropped. <br /> *Bonus already vested till date shall stand reduced proportionately. </p>
          </td>
        </tr>
        <tr>
          <td> (*To be deleted where not applicable) </td>
        </tr>
        <tr>
          <td className="text-align:right;"> for LIFE INSURANCE CORPORATION OF INDIA </td>
        </tr>
        <tr>
          <td className="text-align:right;">
            <br /> p.Sr/Branch Manager. </td>
        </tr>
      </table>
    </PalmyraForm>
  );
};

export { Template3543 };

