import { TextView } from 'templates/mantineForm'; import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV6 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>

      <table width="600">
        <h1 className='text-center font-bold'>Policy Loan Sanction Letter</h1>

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
                <p className="text-justify"> With reference to your application dated <strong><TextView attribute="value1" /></strong> for a loan against your Life Insurance Policy No. <strong><TextView attribute="value2" /></strong>, we are pleased to inform you that a loan of Rs <strong>1,50,000</strong> /- has been sanctioned in your favour.
                  <br /><br /> The loan amount will be disbursed to your registered bank account <strong><TextView attribute="value3" /></strong> within 3 working days from the date of this letter.
                  <br /><br /> The loan carries an interest rate of <strong><TextView attribute="value4" /> per annum</strong>, payable half-yearly. The policy will continue to participate in future bonuses subject to regular payment of loan interest.
                  <br /><br /> Kindly note that non-payment of loan interest may result in adjustment of dues from the policy value as per company norms.
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

export { TemplateV6 };
