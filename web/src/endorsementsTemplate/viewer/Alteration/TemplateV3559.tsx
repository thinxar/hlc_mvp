import { TextView } from 'templates/mantineForm'; import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3559 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" >
        <tr>
          <td>
            <h5 className="text-right">Form No. 3559</h5>
            <h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
            <h4 className="text-center">
              <u>Removal of Occupation Extra Premium (Military, Aviation, Gliding or Parachuting)</u>
            </h4>
            <br />
            <table width="600">
              <tr>
                <td width="25"></td>
                <td align="left"> Place: <b><TextView attribute="branchName" /></b>
                </td>
                <td align="right"> Date: <b><TextView attribute="currDate" /></b>
                </td>
                <td width="25"></td>
              </tr>
            </table>
            <br /><br />
            <table width="600">
              <tr>
                <td width="25"></td>
                <td width="550" align="center">
                  <b>Re : Policy Number :</b>
                  <b><TextView attribute="polNumber" /></b>
                </td>
                <td width="25"></td>
              </tr>
            </table>
            <br /><br />
            <table width="600">
              <tr>
                <td width="25"></td>
                <td width="550">
                  <p className="text-justify"> At the request of the within named Life Assured, the endorsement dated <b><TextView attribute="value4" /></b> is cancelled and it is hereby agreed and declared that in consequence of the Life Assured being engaged in <b><TextView attribute="value5" /></b>, an extra premium of Rs. <b><TextView attribute="value6" /></b> per thousand sum assured per annum is payable for <b><TextView attribute="value7" /></b> years from <b><TextView attribute="value8" /></b>, and in terms thereof the <b><TextView attribute="value9" /></b> premiums from <b><TextView attribute="value10" /></b> to <b><TextView attribute="value11" /></b> inclusive shall be payable at the rate of Rs <b><TextView attribute="value12" /></b> instead of as within mentioned. The <b><TextView attribute="value13" /></b> premiums from <b><TextView attribute="value14" /></b> shall be payable at the rate of Rs <b><TextView attribute="value15" /></b>. </p>
                </td>
                <td width="25"></td>
              </tr>
            </table>
            <br /><br /><br /><br />
            <table width="600">
              <tr>
                <td width="25"></td>
                <td width="550" align="right"> for LIFE INSURANCE CORPORATION OF INDIA </td>
                <td width="25"></td>
              </tr>
            </table>
            <br />
            <table width="600">
              <tr>
                <td width="25"></td>
                <td width="550" align="right"> {/* <SignatureOfApprover> */} p. Sr/Branch Manager. </td>
                <td width="25"></td>
              </tr>
            </table>
            <br /><br />
          </td>
        </tr>
      </table>
    </PalmyraForm>
  );
};

export { TemplateV3559 };
