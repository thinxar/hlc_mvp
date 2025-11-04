import { TextView } from 'templates/mantineForm'; import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV2 = (props: any) => {
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
                  <p className="text-justify"> The within Policy is Surrendered on <strong><TextView attribute="value1" /></strong> at the request of within Life Assured and/or Assignee <strong><TextView attribute="value2" /></strong>.
                    <br /><br /> The present Surrender Value of the above Policy amounts to Rs <strong><TextView attribute="value3" /></strong> /-.
                    <br /><br /> Since the Policy has been issued subject to a 3-year Lock-in Period from the date of Commencement of the Policy, the above-mentioned Surrender Value is payable on <strong><TextView attribute="value4" /></strong> after deducting the dues, if any, from the said amounts.
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

export { TemplateV2 };
