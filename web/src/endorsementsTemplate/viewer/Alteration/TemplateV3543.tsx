import { TextView } from 'templates/mantineForm'; import { PalmyraForm } from '@palmyralabs/rt-forms';

const TemplateV3543 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" >
        <tr>
          <td>
            <h5 className="text-align:right;">Form No. 3543</h5>
            <h3 className="text-align:center;">LIFE INSURANCE CORPORATION OF INDIA</h3>
            <h4 className="text-align:center;"><u>Reduction in Sum Assured</u></h4>
          </td>
        </tr>
        <tr>
          <td className="width:25px;"></td>
          <td>Place: <b><TextView attribute="branchName" /></b></td>
          <td className="text-align:right;">Date: <b><TextView attribute="currDate" /></b></td>
          <td className="width:25px;"></td>
        </tr>
        <tr>
          <td className="text-align:center;">
            <b>Re : Policy No. <TextView attribute="polNumber" /></b>
          </td>
        </tr>
        <tr>
          <td>
            <p className="text-justify"> At the request of the Life Assured the following alterations are hereby made in the Policy: </p>
          </td>
        </tr>
        <tr>
          <td>
            <p className="text-justify"> Sum Assured reduced to Rs. <b><TextView attribute="value4" /></b> from the premium due <b><TextView attribute="value5" /></b>. <b><TextView attribute="value6" /></b> premiums from <b><TextView attribute="value7" /></b> @ Rs. <b><TextView attribute="value8" /></b>. </p>
          </td>
        </tr>
        <tr>
          <td >
            <p className="text-justify"> The sum of Rs. <b><TextView attribute="value9" /></b> has been paid as surrender value* inclusive of cash value of bonus in respect of the portion of the Sum Assured dropped. <br /> *Bonus already vested till date shall stand reduced proportionately. </p>
          </td>
        </tr>
        <tr>
          <td> (*To be deleted where not applicable) </td>
        </tr>
        <tr>
          <td className="text-align:right;"> for LIFE INSURANCE CORPORATION OF INDIA </td>
        </tr>
        <tr>
          <td className="text-align:right;">
            <br /> p.Sr/Branch Manager. </td>
        </tr>
      </table>
    </PalmyraForm>
  );
};

export { TemplateV3543 };

