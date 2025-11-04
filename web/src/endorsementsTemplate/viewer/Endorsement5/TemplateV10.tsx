import { TextView } from 'templates/mantineForm'; import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV10 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600">
        <h1 className='text-center font-bold'>Death Claim Settlement Intimation</h1>

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
                <p className="text-justify"> We extend our sincere condolences on the demise of <strong><TextView attribute="value1" /></strong>, the Life Assured under Policy No. <strong><TextView attribute="value2" /></strong>.
                  <br /><br /> The death claim amount of Rs <strong><TextView attribute="value3" /></strong> /- along with accrued bonuses has been processed and will be credited to the nominee <strong><TextView attribute="value4" /></strong> (Relationship: Spouse) on or before <strong><TextView attribute="value5" /></strong>.
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

export { TemplateV10 };
