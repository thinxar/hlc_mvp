import { DatePicker, TextField, } from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3551 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" >
        <tr>
          <td>
            <h5 className="text-align:right;">Form No. 3551</h5>
            <h3 className="text-align:center;">LIFE INSURANCE CORPORATION OF INDIA</h3>
            <h4 className="text-align:center;">
              <u>Waiver of monthly charge in consequence of payment of premiums by Banker's Orders, by deduction from salary or out of Superannuation Fund.</u>
            </h4>
            <br />
            <table width="600">
              <tr>
                <td width="25"></td>
                <td align="left"> Place: <TextField attribute="branchName" type="text" /> </td>
                <td align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly /> </td>
                <td width="25"></td>
              </tr>
            </table>
            <br />
            <center>
              <b>Re : Policy No.</b> <TextField attribute="polNumber" type="text" readOnly /> </center>
            <br /><br />
            <table>
              <tr>
                <td width="25"></td>
                <td width="550">
                  <p className="justify"> Notwithstanding anything within mentioned to the contrary, it is hereby declared and agreed that the monthly premiums from <TextField attribute="value4" type="text" /> shall be payable at the rate of Rs <TextField attribute="value5" type="text" /> only, if they are paid through (i) Banker's Order (ii) Trustees of a Staff Provident or Superannuation Fund, (iii) Co-operative Society or (iv) collections made by or under the supervision of his employer and remitted to the Corporation.</p>
                </td>
                <td width="25"></td>
              </tr>
            </table>
            <br />
            <table>
              <tr>
                <td width="25"></td>
                <td width="550">
                  <p className="justify"> If the premiums are remitted by the Employer by deduction from Salary, the due dates of monthly premium will be deemed to be 20th of every month, instead of the due date within mentioned. </p>
                </td>
                <td width="25"></td>
              </tr>
            </table>
            <br /><br />
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
            <br /><br />
          </td>
        </tr>
      </table>
    </PalmyraForm>
  );
};

export { Template3551 };
