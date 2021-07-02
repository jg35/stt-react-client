import React, { useState } from "react";
import { CardElement, useElements } from "@stripe/react-stripe-js";
import SubmitButton from "~/components/submitButton";

export default function StripeForm({ handleSubmit }) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const elements = useElements();

  function submitFormHandler(event) {
    event.preventDefault();
    setIsSubmitting(true);

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // Use card Element to tokenize payment details
    const confirmCardPaymentForm = {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: name,
        },
      },
    };

    handleSubmit(confirmCardPaymentForm)
      .then((data) => {
        console.log(data);
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        setIsSubmitting(false);
      });
  }

  return (
    <>
      <form
        onSubmit={submitFormHandler}
        className="border shadow-xl p-4 my-6 rounded-lg"
        style={{ maxWidth: "36rem" }}
      >
        <h1 className="text-xl mb-6">Payment details</h1>
        <div className="form-control">
          <label className="font-medium">Full name</label>
          <input
            className="input"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="font-medium">Your card</label>

          <div className="p-4 rounded bg-lightestGray">
            <CardElement
              options={{
                style: {
                  base: {
                    // iconColor: "#c4f0ff",
                    color: "#000",
                    fontWeight: "400",
                    fontFamily: "futura-pt, sans-serif",
                    fontSize: "18px",
                    fontSmoothing: "antialiased",

                    // ":-webkit-autofill": {
                    //   color: "#fce883",
                    // },
                    // "::placeholder": {
                    //   color: "#87BBFD",
                    // },
                  },
                  invalid: {
                    // iconColor: "#FFC7EE",
                    // color: "#FFC7EE",
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <SubmitButton
            isSubmitting={isSubmitting}
            style={{ minWidth: "100%" }}
          >
            {isSubmitting ? "Submit payment details" : "Submit payment details"}
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
