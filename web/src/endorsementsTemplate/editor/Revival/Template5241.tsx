import { TextField, } from 'templates/mantineForm';
import { PalmyraForm } from '@palmyralabs/rt-forms';

const Template5241 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" >
        <tr>
          <td>
            <h3 className="text-right">Annexure-3</h3>
            <p className="text-center">Policy No. : <TextField attribute="polNumber" type="text" readOnly /></p>
            <h3 className="text-center"> Endorsement to Policy Document for Revival<br /> (For LIC New Endowment Plus) </h3>
            <table width="600">
              <tr>
                <td width="250"><b>Definition :</b></td>
              </tr>
              <tr>
                <td width="200" align="justify">
                  <b>1. Revival</b> of a policy means restoration of the policy, which was discontinued due to non-payment of premium, by the insurer with all the benefits mentioned in the policy document, with or without rider benefits if any, upon the receipt of all the premiums due and other charges or late fee, if any, as per the terms and conditions of the policy, upon being satisfied as to the Continued Insurability of the Life Assured. </td>
              </tr>
              <tr>
                <td width="200" align="justify">
                  <b>2. Revival Period</b> is the period of three consecutive years from the date of discontinuance of the policy or up to date of maturity, whichever is earlier, during which period the policyholder is entitled to revive the policy which was discontinued due to the non-payment of premium(s). </td>
              </tr>
              <tr>
                <td width="200" align="justify">
                  <b>3. Continued Insurability</b> is the determination of insurability of Life Assured on revival of policy with rider(s) if opted for, to the satisfaction of the Corporation based on the information, documents and reports that are already available and any additional information in this regard if and as may be required in accordance with the Underwriting Policy of the Corporation at the time of revival. </td>
              </tr>
            </table>
            <br />
            <table width="600">
              <tr>
                <td width="300"></td>
                <td width="250" align="right"> {/* <SignatureOfApprover> */} p. Chief / Sr / Branch Manager </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </PalmyraForm >
  );
};

export { Template5241 };
