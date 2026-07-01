import {
    Goal
} from "lucide-react";

import {
    useGetAppraisalIdpQuery
} from "../../../api_service/appraisal/appraisal.api";

import "./IDP.css";

import type {
    AppraisalStatus
} from "../../../types/appraisal";

interface IDPProps {
    appraisalId: number;
    appraisalStatus: AppraisalStatus;
}

function IDP({
    appraisalId
}: IDPProps) {

    const {
        data: idpData,
        isLoading
    } = useGetAppraisalIdpQuery(
        appraisalId,
        {
            skip: !appraisalId
        }
    );

    return (
        <div className="idp-card">

            <div className="idp-header">

                <div className="idp-title">

                    <Goal
                        size={18}
                        strokeWidth={2.3}
                    />

                    Individual Development Plan (IDP)

                </div>

            </div>

            <div className="idp-divider" />

            {isLoading ? (

                <div className="idp-placeholder">
                    Loading...
                </div>

            ) : (

                <div className="idp-content">

                    {idpData?.idp_text ? (
                        idpData.idp_text
                    ) : (
                        <span className="idp-placeholder">
                            No development plan has been added yet.
                        </span>
                    )}

                </div>

            )}

        </div>
    );
}

export default IDP;