import { TextField, } from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template10 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600">
        <h1 className='text-center font-bold'>Death Claim Settlement Intimation</h1>
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
                <p className="text-justify"> We extend our sincere condolences on the demise of <strong><TextField attribute="value1" type="text" /></strong>, the Life Assured under Policy No. <strong><TextField attribute="value2" type="text" /></strong>.
                  <br /><br /> The death claim amount of Rs <strong><TextField attribute="value3" type="text" /></strong> /- along with accrued bonuses has been processed and will be credited to the nominee <strong><TextField attribute="value4" type="text" /></strong> (Relationship: Spouse) on or before <strong><TextField attribute="value5" type="text" /></strong>.
                  <br /><br /> Please find enclosed the claim settlement details and acknowledgment copy for your reference.
                  <br /><br /> We once again convey our deepest sympathies to the bereaved family.
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

export { Template10 };
