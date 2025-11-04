import { TextField, } from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template2 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>

      <table width="600">
        <h1 className='text-center font-bold'>Sample Policy Surrender Form</h1>
        <tr>
          <th>
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
                  <p className="text-justify"> The within Policy is Surrendered on <strong><TextField attribute="value1" type="text" /></strong> at the request of within Life Assured and/or Assignee <strong><TextField attribute="value2" type="text" /></strong>.
                    <br /><br /> The present Surrender Value of the above Policy amounts to Rs <strong><TextField attribute="value3" type="text" /></strong> /-.
                    <br /><br /> Since the Policy has been issued subject to a 3-year Lock-in Period from the date of Commencement of the Policy, the above-mentioned Surrender Value is payable on <strong><TextField attribute="value4" type="text" /></strong> after deducting the dues, if any, from the said amounts.
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
                  <br /><br />
                  <strong>Authorized Signatory</strong><br /> p. Sr/Branch Manager
                </td>
                <td width="25"></td>
              </tr>
            </table>
            <br /><br />
          </th>
        </tr>
      </table>
    </PalmyraForm>
  );
};

export { Template2 };
