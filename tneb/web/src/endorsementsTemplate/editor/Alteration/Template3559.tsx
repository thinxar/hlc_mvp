import { DatePicker, TextField, } from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3559 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" >
        <tr>
          <td>
            <h5 className="text-right">Form No. 3559</h5>
            <h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
            <h4 className="text-center">
              <u>Removal of Occupation Extra Premium (Military, Aviation, Gliding or Parachuting)</u>
            </h4>
            <br />
            <table width="600">
              <tr>
                <td width="25"></td>
                <td align="left"> Place: <b><TextField attribute="branchName" type="text" /></b>
                </td>
                <td align="right"> Date: <b> <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly /></b>
                </td>
                <td width="25"></td>
              </tr>
            </table>
            <br /><br />
            <table width="600">
              <tr>
                <td width="25"></td>
                <td width="550" align="center">
                  <b>Re : Policy Number :</b>
                  <b><TextField attribute="polNumber" type="text" readOnly /></b>
                </td>
                <td width="25"></td>
              </tr>
            </table>
            <br /><br />
            <table width="600">
              <tr>
                <td width="25"></td>
                <td width="550">
                  <p className="text-justify"> At the request of the within named Life Assured, the endorsement dated <b><TextField attribute="value4" type="text" /></b> is cancelled and it is hereby agreed and declared that in consequence of the Life Assured being engaged in <b><TextField attribute="value5" type="text" /></b>, an extra premium of Rs. <b><TextField attribute="value6" type="text" /></b> per thousand sum assured per annum is payable for <b><TextField attribute="value7" type="text" /></b> years from <b><TextField attribute="value8" type="text" /></b>, and in terms thereof the <b><TextField attribute="value9" type="text" /></b> premiums from <b><TextField attribute="value10" type="text" /></b> to <b><TextField attribute="value11" type="text" /></b> inclusive shall be payable at the rate of Rs <b><TextField attribute="value12" type="text" /></b> instead of as within mentioned. The <b><TextField attribute="value13" type="text" /></b> premiums from <b><TextField attribute="value14" type="text" /></b> shall be payable at the rate of Rs <b><TextField attribute="value15" type="text" /></b>. </p>
                </td>
                <td width="25"></td>
              </tr>
            </table>
            <br /><br /><br /><br />
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
                <td width="550" align="right"> {/* <SignatureOfApprover> */} p. Sr/Branch Manager. </td>
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

export { Template3559 };
