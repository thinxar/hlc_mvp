import { TextField, } from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
          <table width="600" align="center">
            <h1 className='text-center font-bold'>Policy Maturity Payout Acknowledgment</h1>
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
                    <p className="text-justify"> We hereby acknowledge the receipt of request from <strong><TextField attribute="value1" type="text" /></strong> for the maturity payout of his Life Insurance Policy No. <strong><TextField attribute="value2" type="text" /></strong>, which matured on <strong><TextField attribute="value3" type="text" /></strong>.
                      <br /><br /> The total maturity benefit payable under the policy amounts to Rs <strong><TextField attribute="value4" type="text" /></strong> /-, inclusive of accrued bonuses as per policy terms.
                      <br /><br /> The said amount will be credited to the registered bank account <strong><TextField attribute="value5" type="text" /></strong> on or before <strong><TextField attribute="value6" type="text" /></strong>.
                      <br /><br /> We thank you for your continued association and trust in our services.
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

export { Template5 };
