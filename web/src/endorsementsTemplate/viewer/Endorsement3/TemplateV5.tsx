import { TextView } from 'templates/mantineForm'; import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV5 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" align="center">
        <h1 className='text-center font-bold'>Policy Maturity Payout Acknowledgment</h1>

        <tr><th>
          <br /><br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td align="left">Place: <TextView attribute="place" /></td>
              <td align="right">Date: <TextView attribute="date" /></td>
              <td width="25"></td>
            </tr>
          </table>
          <br /><br /><br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td width="550">
                <p className="text-justify"> We hereby acknowledge the receipt of request from <strong><TextView attribute="value1" /></strong> for the maturity payout of his Life Insurance Policy No. <strong><TextView attribute="value2" /></strong>, which matured on <strong><TextView attribute="value3" /></strong>.
                  <br /><br /> The total maturity benefit payable under the policy amounts to Rs <strong><TextView attribute="value4" /></strong> /-, inclusive of accrued bonuses as per policy terms.
                  <br /><br /> The said amount will be credited to the registered bank account <strong><TextView attribute="value5" /></strong> on or before <strong><TextView attribute="value6" /></strong>.
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

export { TemplateV5 };
