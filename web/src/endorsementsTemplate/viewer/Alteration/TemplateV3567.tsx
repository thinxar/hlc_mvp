import { PalmyraForm } from '@palmyralabs/rt-forms';
import { TextView } from 'templates/mantineForm';

const TemplateV3567 = (props: any) => {
  return (
    <PalmyraForm ref={props.formRef} formData={props.formData}>
      <table width="600" border={1}>
        <tbody>
          <th>
            <h5 className="text-right"> Form No. 3567 </h5>
            <h3 className="text-center">LIFE INSURANCE CORPORATION OF INDIA</h3>

            <h5 className="text-center"><u>ENDORSEMENT FOR PAYMENT OF CLAIM IN THE SHAPE OF A LIFE ANNUITY</u></h5>
            <br />
            <table width="600">
              <tbody><tr>
                <td width="25"></td>
                <td width="200" align="left"> Place: <TextView attribute="branchName"  />
                </td><td width="350" align="right"> Date: <TextView attribute="currDate"/>
                </td>
              </tr>
              </tbody></table><br />
            <br />
            <table width="600">
              <tbody><tr>
                <td width="25"></td>
                <td width="550">
                  <p className="text-align: justify;">
                    Notwithstanding anything within mentioned to the contrary it is hereby declared that on
                    a written request of the
                    within named Life Assured made prior to the date of maturity, that is <TextView  attribute="value3" />, the Life Assured may, in the
                    event of his surviving to the date of maturity and provided the policy is in force for
                    the full sum Assured elect in lieu of the sum Assured any one of the following options
                    under the following plan :-
                  </p>
                </td>
                <td width="25"></td>
              </tr>
              </tbody></table><br />

            <table width="600" border={1} className=''>
              <tbody><tr>
                <td width="30"></td>
                <td width="150" align="center" className='border-1 border-gray-600 '>NATURE OF ANNUITY</td>
                <td width="410" align="center" className='border-1 border-gray-600'>Amount of Annuity per annum payable as specified below for the
                  term specified in column (1) corresponding to a claim of Rs.
                  1,000
                  <hr />
                  <table className=''>
                    <tbody><tr>
                      <td width="100" align="center" > Yearly </td>
                      <td width="100" align="center"> Half -Yearly </td>
                      <td width="110" align="center" > Quarterly </td>
                      <td width="100" align="center" > Monthly </td>
                    </tr>
                    </tbody></table>
                </td>

              </tr><tr>
                  <td width="20"></td>
                  <td width="150" align="center" className='border-1 border-gray-600 '> 1 </td>
                  <td width="410" className='border-1 border-gray-600'>
                    <table>
                      <tbody><tr>
                        <td width="100" align="center" > 2 </td>
                        <td width="100" align="center" > 3 </td>
                        <td width="110" align="center" > 4 </td>
                        <td width="100" align="center" > 5 </td>
                      </tr>
                      </tbody></table>
                  </td>

                </tr><tr>
                  <td width="20"></td>
                  <td width="150" align="center" className='border border-gray-600'>
                    <table className=''>
                      <tbody><tr>
                        <td width="20" align="center" > (a) </td>
                        <td width="130" align="left" className=''> Payable for life </td>
                      </tr>
                      </tbody></table>
                  </td>
                  <td width="410" className='border border-gray-600' >
                    <table>
                      <tbody><tr >
                        <td width="100" align="center"> <TextView  attribute="value4" /> </td>
                        <td width="100" align="center"> <TextView  attribute="value5" /> </td>
                        <td width="110" align="center"> <TextView  attribute="value6" /> </td>
                        <td width="100" align="center"> <TextView  attribute="value7" /> </td>
                      </tr>
                      </tbody></table>
                  </td>
                </tr><tr>
                  <td width="20"></td>
                  <td width="150" align="center" className='border border-gray-600'>
                    <table>
                      <tbody><tr>
                        <td width="20" valign="top" > (b) </td>
                        <td width="130" align="left" className=''> Payable for <TextView attribute="value8" /> years certain and so long hereafter as
                          the assured may be alive</td>
                      </tr>
                      </tbody></table>
                  </td>
                  <td width="410" className='border border-gray-600'>
                    <table >
                      <tbody><tr>
                        <td width="100" height="20" align="center"> <TextView  attribute="value9" /> </td>
                        <td width="100" align="center"> <TextView  attribute="value10" /> </td>
                        <td width="110" align="center"> <TextView  attribute="value11" /> </td>
                        <td width="100" align="center"> <TextView  attribute="value12" /> </td>
                      </tr>
                      </tbody></table>
                  </td>
                </tr>
              </tbody></table>
            <br /><br />
            <table width="600" border={0}>
              <tbody>
                <tr>
                  <td width="25"></td>
                  <td width="550">
                    <p className="text-align: justify;">1. <i>Commencement of payment of Instalments :</i>The first
                      instalment of the Annuity will become
                      payable one year, six months, three months or one month after the date of maturity of
                      the policy
                      according as the mode of payment of the Annuity is yearly, half- yearly, quarterly or
                      monthly.
                    </p>
                    <p className="text-align: justify;">2. <i>Duration of payment of Instalments :</i> In the case
                      of Annuity for life, instalments will be
                      continued to be paid so long as the Assured is alive. In the case of Annuity for <TextView  attribute="value13" />
                      years certain and so
                      long thereafter as the Assured may be alive the instalments will be continued to be
                      paid for <TextView  attribute="value14" /> years
                      certain whether the Assured is then alive or not and if he
                      survives the period, will be continued to be paid so long as he is alive.
                    </p>
                    <p className="text-align: justify;">3.<i>Cessation of Instalments :</i> In all cases where the
                      instalments are to terminate on death,
                      the instalments will cease with payment of the instalment due before the date of death
                      of the Assured,
                      and no payment shall be made for such time as may elapse between the day immediately
                      preceding
                      the death of the Life Assured on which an instalment fell due and the day of his death.
                    </p>
                    <p className="text-align: justify;">4. In all cases where an instalment is payable only if the
                      Life Assured is alive, the subsistence the Assured's life at 12 O'clock on the day on
                      which such instalment falls due will be required to certified from time to time in such
                      manner as may be required.
                    </p>
                  </td>
                </tr>
              </tbody></table>

            <br />
            <br />
            <br />
            <table width="600">
              <tbody><tr>
                <td width="25"></td>
                <td width="550" align="right">
                  for LIFE INSURANCE CORPORATION OF INDIA
                </td>
                <td width="25"></td>
              </tr>
              </tbody></table>
            <br />
            <table width="600">
              <tbody><tr>
                <td width="25"></td>
                <td width="550" align="right">
                  {/* <signatureofapprover> */}
                  <br />
                  p.Sr/Branch Manager.

                </td>
                {/* </signatureofapprover></td> */}
                <td width="25"></td>
              </tr>
              </tbody></table>

            <br />
            <br />
          </th>

        </tbody>
      </table>
    </PalmyraForm>
  );
};

export { TemplateV3567 };
