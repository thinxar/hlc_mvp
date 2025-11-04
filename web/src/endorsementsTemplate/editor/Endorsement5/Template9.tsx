import { TextField, } from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template9 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" align="center">
        <h1 className='text-center font-bold'>Policy Nominee Change Confirmation</h1>
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
                <p className="text-justify"> We acknowledge receipt of your request dated <strong><TextField attribute="value1" type="text" /></strong> for change of nominee under your Life Insurance Policy No. <strong><TextField attribute="value2" type="text" /></strong>.
                  <br /><br /> We confirm that the nominee has been updated in our records as <strong><TextField attribute="value3" type="text" /></strong> (Relationship: Spouse).
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

export { Template9 };
