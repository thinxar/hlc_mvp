import { TextView } from 'templates/mantineForm'; import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3544 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" >
        <tr>
          <td>
            <h5 className="text-align:right;">Form No. 3544</h5>
            <h3 className="text-align:center;">LIFE INSURANCE CORPORATION OF INDIA</h3>
            <h5 className="text-align:center;"><u>REDUCTION IN SUM ASSURED WITH REDUCTION IN CASH OPTION</u></h5>
          </td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td align="left">Place: <b><TextView attribute="branchName" /></b></td>
          <td align="right">Date: <b><TextView attribute="currDate" /></b></td>
          <td className="width:25px;"></td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td className="text-align:center;">
            <b>Re : Policy No. <TextView attribute="polNumber" /></b>
          </td>
          <td className="width:25px;"></td>
        </tr>
        <tr><td><br /></td></tr>
        <tr>
          <td className="width:25px;"></td>
          <td>
            <p className="text-justify"> At the request of the <b><TextView attribute="value4" /></b> (Proposer/Life Assured), the following alterations are hereby made in the Policy: </p>
          </td>
          <td className="width:25px;"></td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td>
            <p className="text-justify"> Sum Assured reduced to Rs. <b><TextView attribute="value5" /></b> from <b><TextView attribute="value6" /></b> (due date of the premium). </p>
          </td>
          <td className="width:25px;"></td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td>
            <p className="text-justify"> Cash Option reduced to Rs. <b><TextView attribute="value7" /></b> premium from <b><TextView attribute="value8" /></b> at Rs. <b><TextView attribute="value9" /></b>. </p>
          </td>
          <td className="width:25px;"></td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td>
            <p className="text-justify"> The sum of Rs. <b><TextView attribute="value10" /></b> has been paid as surrender value of the portion of the Sum Assured dropped. </p>
          </td>
          <td className="width:25px;"></td>
        </tr>
        <tr><td><br /><br /></td></tr>
        <tr>
          <td className="width:25px;"></td>
          <td className="text-align:right;"> for LIFE INSURANCE CORPORATION OF INDIA </td>
          <td className="width:25px;"></td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td className="text-align:right;">
            <br /> SignatureOfApprover<br /> p.Sr/Branch Manager. </td>
          <td className="width:25px;"></td>
        </tr>
      </table>
    </PalmyraForm>
  );
};

export { TemplateV3544 };
