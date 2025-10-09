import { DatePicker, TextField, } from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template3734 = (props: any) => {
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
              <td align="left"> Place: <TextField attribute="branchName" type="text" /> </td>
              <td align="right"> Date:  <DatePicker attribute="currDate" placeholder="dd-mm-yyyy" readOnly /> </td>
              <td width="25"></td>
            </tr>
          </table>
          <br />
          <center>
            <b>Re : Policy Number : <TextField attribute="polNumber" type="text" readOnly /></b>
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
              <td width="550"><p className="text-justify"> Age at entry Admitted: Male Life <TextField attribute="value4" type="text" /> years/Female Life <TextField attribute="value5" type="text" /> years. <br />
                <hr /> <TextField attribute="value6" type="text" /> premiums payable from <TextField attribute="value7" type="text" /> altered to Rs. <TextField attribute="value8" type="text" /> . </p></td>
              <td width="25"></td>
            </tr>
          </table>
          <br />
          <div style={{ borderTop: "solid", borderTopWidth: "1", paddingTop: "1px" }}></div>
          <br />
          <table width="600">
            <tr>
              <td width="25"></td>
              <td width="550"> Received/Refunded Rs. <TextField attribute="value9" type="text" /> in respect of difference/excess of the premiums paid with interest thereon. </td>
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

export { Template3734 };
