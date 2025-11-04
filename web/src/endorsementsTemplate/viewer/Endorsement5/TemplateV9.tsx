import { TextView } from 'templates/mantineForm'; import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV9 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" align="center">
        <h1 className='text-center font-bold'>Policy Nominee Change Confirmation</h1>

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
                <p className="text-justify"> We acknowledge receipt of your request dated <strong><TextView attribute="value1" /></strong> for change of nominee under your Life Insurance Policy No. <strong><TextView attribute="value2" /></strong>.
                  <br /><br /> We confirm that the nominee has been updated in our records as <strong><TextView attribute="value3" /></strong> (Relationship: Spouse).
                  <br /><br /> All future policy benefits, in case of an unfortunate event, shall be payable to the above nominee as per the terms and conditions of your policy.
                  <br /><br /> Thank you for keeping your policy details up to date.
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

export { TemplateV9 };
