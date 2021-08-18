import React, { useContext, useState, useEffect } from "react";
import { DateTime } from "luxon";

import UserDetailsForm from "~/components/onboarding/userDetailsForm";
import Tutorial from "~/components/tutorial";
import { AuthContext } from "~/components/authWrap";
import DeleteModal from "~/components/deleteModal";
import { UIContext } from "~/app";
import UserPaymentForm from "~/components/userPaymentForm";
import UserVerifyForm from "~/components/userVerifyForm";
import AccessListModal from "~/components/accessList/accessListModal";

export default function AccessControlModals() {
  const {
    authState: { dbUser, user },
  } = useContext(AuthContext);
  const { uiState, updateUiState } = useContext(UIContext);
  const [showVerifyEmail] = useState(!user.emailVerified);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  function hasExpired(expiresDate, isSeconds) {
    if (isSeconds) {
      return (
        DateTime.fromSeconds(expiresDate).diffNow().toObject().milliseconds <= 0
      );
    }
    return DateTime.fromISO(expiresDate).diffNow().toObject().milliseconds <= 0;
  }

  useEffect(() => {
    if (dbUser) {
      const subStatus = dbUser.subscriptionStatus;
      let paymentState = {
        subscriptionStatus: dbUser.subscriptionStatus,
        stripeCustomerId: dbUser.stripeCustomerId,
      };
      if (
        (subStatus === "IN_TRIAL" && hasExpired(dbUser.trialExpiresDate)) ||
        subStatus === "CANCELLED" ||
        (subStatus === "CANCEL_AT_PERIOD_END" &&
          hasExpired(dbUser.subscriptionMeta?.periodEnd, true))
      ) {
        paymentState.showModal = true;
        paymentState.type = "CHOOSE_PLAN";
      } else if (subStatus === "PAYMENT_FAILED") {
        paymentState.showModal = true;
        paymentState.type = "MANAGE_PLAN";
      }
      if (paymentState.showModal) {
        paymentState.intent = "AUTO";
        updateUiState({ payment: paymentState }, false);
      }

      setShowTutorial(dbUser.onboarding === false);
      setShowUserForm(!dbUser.dob && !dbUser.location);
    }
  }, [dbUser]);

  // In order of precendence. We only ever show one of these.

  if (showVerifyEmail) {
    return <UserVerifyForm />;
  }

  if (uiState.payment.showModal) {
    return (
      <UserPaymentForm
        {...uiState.payment}
        closeModal={() =>
          updateUiState({
            payment: {
              showModal: false,
              type: "CHOOSE_PLAN",
              intent: "AUTO",
              subscriptionStatus: null,
              stripeCustomerId: null,
            },
          })
        }
      />
    );
  }

  if (uiState.deleteModal.show) {
    return (
      <DeleteModal
        title={uiState.deleteModal.title}
        onDelete={() => {
          updateUiState(
            {
              deleteModal: {
                ...uiState.deleteModal,
                confirm: true,
              },
            },
            false
          );
        }}
        onCancel={() => {
          updateUiState(
            {
              deleteModal: {
                ...uiState.deleteModal,
                cancelled: true,
              },
            },
            false
          );
        }}
      />
    );
  }

  if (uiState.showAccessListModal) {
    return (
      <AccessListModal
        userId={user.id}
        show={true}
        closeModal={() => updateUiState({ showAccessListModal: false }, false)}
      />
    );
  }

  if (showUserForm) {
    return <UserDetailsForm />;
  }

  if (showTutorial) {
    return <Tutorial />;
  }

  return null;
}
