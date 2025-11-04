import { TextField, } from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template7 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" align="center">
        <h1 className='text-center font-bold'>Policy Revival Confirmation Letter</h1>
        <tr><th>
          <br /><br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td align="left">Place: <TextField attribute="place" type="text" /></td>
              <td align="right">Date: <TextField attribute="date" type="text" /></td>
              <td width="25"></td>
            </tr>
          </table>
          <br /><br /><br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td width="550">
                <p className="text-justify"> We are pleased to inform you that your Life Insurance Policy No. <strong><TextField attribute="value1" type="text" /></strong>, which had lapsed due to non-payment of premiums, has been successfully revived with effect from <strong><TextField attribute="value2" type="text" /></strong>.
                  <br /><br /> The revival has been carried out upon receipt of the arrears of premium amounting to Rs <strong><TextField attribute="value3" type="text" /></strong> /-, along with interest as applicable under the policy terms and conditions.
                  <br /><br /> The policy now continues in full force, and all the benefits and terms stand reinstated as per the original policy document.
                  <br /><br /> We appreciate your continued trust and relationship with our organization and wish you a long and secure association ahead.
                </p>
              </td>
              <td width="25"></td>
            </tr>
          </table>
          <br /><br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td width="550" align="right">
                <strong>Authorized Signatory</strong><br /> p. Sr/Branch Manager
              </td>
              <td width="25"></td>
            </tr>
          </table>
          <br /><br />
        </th></tr></table>
    </PalmyraForm>
  );
};

export { Template7 };
