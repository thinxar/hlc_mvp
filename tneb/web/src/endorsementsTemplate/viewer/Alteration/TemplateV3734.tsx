import { TextView } from 'templates/mantineForm'; import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3734 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" >
        <th>
          <h5 className="text-right">Form No. 3734</h5>
          <h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>
          <h5 className="text-center"><u>AGE PROVED HIGHER, PREMIUM ALTERED (JOINT LIFE POLICY)</u></h5>
          <br />
          <br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td align="left"> Place: <TextView attribute="branchName" /> </td>
              <td align="right"> Date: <TextView attribute="currDate" /> </td>
              <td width="25"></td>
            </tr>
          </table>
          <br />
          <center>
            <b>Re : Policy Number : <TextView attribute="polNumber" /></b>
          </center>
          <br />
          <br />
          <table>
            <tr>
              <td width="25"></td>
              <td width="550"><p className="text-justify"> Satisfactory evidence having been produced regarding the life Assured's age the following alterations are hereby made in the Policy. </p></td>
              <td width="25"></td>
            </tr>
          </table>
          <br />
          <div style={{ borderTop: "solid", borderTopWidth: "1", paddingTop: "1px" }}></div>
          <br />
          <table>
            <tr>
              <td width="25"></td>
              <td width="550"><p className="text-justify"> Age at entry Admitted: Male Life <TextView attribute="value4" /> years/Female Life <TextView attribute="value5" /> years. <br />
                <hr /> <TextView attribute="value6" /> premiums payable from <TextView attribute="value7" /> altered to Rs. <TextView attribute="value8" /> . </p></td>
              <td width="25"></td>
            </tr>
          </table>
          <br />
          <div style={{ borderTop: "solid", borderTopWidth: "1", paddingTop: "1px" }}></div>
          <br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td width="550"> Received/Refunded Rs. <TextView attribute="value9" /> in respect of difference/excess of the premiums paid with interest thereon. </td>
              <td width="25"></td>
            </tr>
          </table>
          <br />
          <br />
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
              <td width="550" align="right"> {/* <SignatureOfApprover> */} <br /> p.Sr/Branch Manager. </td>
              <td width="25"></td>
            </tr>
          </table>
          <br />
          <br />
        </th>
      </table>
    </PalmyraForm>
  );
};

export { TemplateV3734 };
