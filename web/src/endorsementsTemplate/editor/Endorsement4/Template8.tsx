import { TextField, } from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template8 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" align="center">
        <h1 className='text-center font-bold'>Policy Premium Payment Reminder</h1>
        <tr><th>
          <br /><br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td align="left">Place: : <TextField attribute="place" type="text" /></td>
              <td align="right">Date: : <TextField attribute="date" type="text" /></td>
              <td width="25"></td>
            </tr>
          </table>
          <br /><br /><br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td width="550">
                <p className="text-justify"> Dear <strong>: <TextField attribute="value1" type="text" /></strong>,<br /><br /> This is to remind you that the next premium for your Life Insurance Policy No. <strong>: <TextField attribute="value2" type="text" /></strong> is due on <strong>: <TextField attribute="value3" type="text" /></strong>. The payable premium amount is Rs <strong><TextField attribute="value4" type="text" /></strong> /-. <br /><br /> Kindly ensure payment on or before the due date to keep your policy active and continue enjoying uninterrupted life cover benefits.
                  <br /><br /> You may pay the premium through our website, mobile app, or by visiting your nearest branch.
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

export { Template8 };
